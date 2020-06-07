package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"

	"github.com/MarekVigas/Postar-Jano/internal/resources"

	"github.com/MarekVigas/Postar-Jano/internal/model"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type PostgresRepo struct {
	db *sqlx.DB
}

var ErrOverLimit = errors.New("Limit exceeded")

func NewPostgresRepo(db *sql.DB) *PostgresRepo {
	return &PostgresRepo{
		db: sqlx.NewDb(db, "postgres"),
	}
}

func getAllTables() []string {
	return []string{
		"registrations",
		"signups",
		"owners",
		"events",
		"days",
	}
}

func Reset(ctx context.Context, db sqlx.ExecerContext) error {
	for _, tableName := range getAllTables() {
		if _, err := db.ExecContext(ctx, fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY CASCADE", tableName)); err != nil {
			return errors.WithStack(err)
		}
	}
	return nil
}

func (repo *PostgresRepo) Ping(ctx context.Context) error {
	if err := repo.db.PingContext(ctx); err != nil {
		return errors.WithStack(err)
	}
	return nil
}

func (repo *PostgresRepo) ListEvents(ctx context.Context) ([]model.Event, error) {
	var events []model.Event
	err := repo.WithTxx(ctx, func(ctx context.Context, tx *sqlx.Tx) error {
		if err := sqlx.SelectContext(ctx, tx, &events, `
			SELECT 
				ev.id,
				ev.title,
				ev.description,
				ev.date_from,
				ev.date_to,
				ev.location,
				ev.min_age,
				ev.max_age,
				ev.info,
				ev.photo,
				ev.time,
				o.name AS owner_name,
				o.surname AS owner_surname,
				o.email AS owner_email,
				o.phone AS owner_phone,
				o.photo AS owner_photo,
				o.gender AS owner_gender
			FROM events ev
			LEFT JOIN owners o ON o.id = ev.owner_id
		`); err != nil {
			return errors.WithStack(err)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return events, nil
}

func (repo *PostgresRepo) FindEvent(ctx context.Context, id int) (*model.Event, error) {
	var event model.Event
	err := repo.WithTxx(ctx, func(ctx context.Context, tx *sqlx.Tx) error {
		if err := sqlx.GetContext(ctx, tx, &event, `
			SELECT 
				ev.id,
				ev.title,
				ev.description,
				ev.date_from,
				ev.date_to,
				ev.location,
				ev.min_age,
				ev.max_age,
				ev.info,
				ev.photo,
				ev.time,
				ev.price,
				o.name AS owner_name,
				o.surname AS owner_surname,
				o.email AS owner_email,
				o.phone AS owner_phone,
				o.photo AS owner_photo,
				o.gender AS owner_gender
			FROM events ev
			LEFT JOIN owners o ON o.id = ev.owner_id
			WHERE ev.id = $1
		`, id); err != nil {
			return errors.WithStack(err)
		}

		if err := sqlx.SelectContext(ctx, tx, &event.Days, `
			SELECT 
				id,
				capacity,
				limit_boys,
				limit_girls,
				description,
				price
			FROM days
			WHERE event_id = $1
			ORDER BY id
		`, id); err != nil {
			return errors.WithStack(err)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return &event, nil
}

func (repo *PostgresRepo) Register(ctx context.Context, req *resources.RegisterReq, eventID int) (*model.RegResult, bool, error) {
	token, err := uuid.NewUUID()
	if err != nil {
		return nil, false, errors.WithStack(err)
	}

	res := model.RegResult{
		Token: token.String(),
	}
	var reg model.Registration
	if err := repo.WithTxx(ctx, func(ctx context.Context, tx *sqlx.Tx) error {

		// List stats.
		stats, err := repo.getStatInternal(ctx, tx, eventID)
		if err != nil {
			return err
		}

		// Validate limits
		for i := range req.DayIDs {
			for _, stat := range stats {
				if stat.DayID != req.DayIDs[i] {
					continue
				}
				if stat.Capacity > stat.GirlsCount+stat.BoysCount {
					break
				}
				if req.Gender == "male" && stat.LimitBoys != nil {
					if stat.BoysCount > *stat.LimitBoys {
						break
					}
				}

				if req.Gender == "female" && stat.LimitGirls != nil {
					if stat.BoysCount > *stat.LimitGirls {
						break
					}
				}
				res.RegisteredIDs = append(res.RegisteredIDs, stat.DayID)
			}
		}

		if len(req.DayIDs) != len(res.RegisteredIDs) {
			res.Success = false
			return ErrOverLimit
		}
		res.Success = true

		// Compute price.
		var amount int

		// Insert into registrations.
		err = repo.db.GetContext(ctx, &reg, `
			INSERT INTO registrations(
				name,
				surname,
				gender,
				amount,
				token,
				date_of_birth,
				finished_school,
				attended_previous,
				city,
				pills,
				notes,
				parent_name,
				parent_surname,
				email,
				phone,
				created_at,
				updated_at
			) VALUES (
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8,
				$9,
				$10,
				$11,
				$12,
				$13,
				$14,
				$15,
				NOW(),
				NOW()
			) RETURNING *
		`, req.Name, req.Surname, req.Gender, amount, token.String(),
			req.DateOfBirth, req.FinishedSchool, req.AttendedPrevious, req.City,
			req.Pills, req.Notes, req.ParentName, req.ParentSurname, req.Email,
			req.Phone)
		if err != nil {
			return errors.Wrap(err, "failed to create a registration")
		}

		// Insert into signups.
		for _, dayID := range req.DayIDs {
			_, err := tx.ExecContext(ctx, `
			INSERT INTO signups(
				day_id,
				registration_id,
				state,
				created_at,
				updated_at
			) VALUES (
				$1,
				$2,
				$3,
				NOW(),
				NOW()
			) RETURNING *
		`, dayID, reg.ID, "init")
			if err != nil {
				return errors.Wrap(err, "failed to create a signup")
			}
		}

		return nil
	}); err != nil {
		if errors.Cause(err) == ErrOverLimit {
			return &res, false, nil
		}
		return nil, false, err
	}

	return &res, true, nil
}

func (repo *PostgresRepo) getStatInternal(ctx context.Context, db sqlx.QueryerContext, eventID int) ([]model.Stat, error) {
	var stats []model.Stat

	if err := sqlx.SelectContext(ctx, db, &stats, `
				SELECT 
					id AS day_id,
					event_id,
					capacity,
					limit_boys,
					limit_girls
				FROM days 
				WHERE event_id = $1
		`, eventID); err != nil {
		return nil, errors.WithStack(err)
	}

	for i := range stats {
		if err := sqlx.GetContext(ctx, db, &stats[i].BoysCount, `
				SELECT
					COUNT(*)
				FROM registrations r
				LEFT JOIN signups s ON s.registration_id = r.id
				LEFT JOIN days d ON s.day_id = d.id
				WHERE r.gender = 'male' AND d.event_id = $1
		`, eventID); err != nil {
			return nil, errors.WithStack(err)
		}

		if err := sqlx.GetContext(ctx, db, &stats[i].GirlsCount, `
				SELECT
					COUNT(*)
				FROM registrations r
				LEFT JOIN signups s ON s.registration_id = r.id
				LEFT JOIN days d ON s.day_id = d.id
				WHERE r.gender = 'female' AND d.event_id = $1
		`, eventID); err != nil {
			return nil, errors.WithStack(err)
		}
	}
	return stats, nil
}

func (repo *PostgresRepo) GetStat(ctx context.Context, eventID int) ([]model.Stat, error) {
	var stats []model.Stat

	err := repo.WithTxx(ctx, func(ctx context.Context, tx *sqlx.Tx) error {
		if err := sqlx.SelectContext(ctx, tx, &stats, `
				SELECT 
					id AS day_id,
					event_id,
					capacity,
					limit_boys,
					limit_girls
				FROM days 
				WHERE event_id = $1
				ORDER BY id
		`, eventID); err != nil {
			return errors.WithStack(err)
		}

		for i := range stats {
			if err := sqlx.GetContext(ctx, tx, &stats[i].BoysCount, `
				SELECT
					COUNT(*)
				FROM registrations r
				LEFT JOIN signups s ON s.registration_id = r.id
				LEFT JOIN days d ON s.day_id = d.id
				WHERE r.gender = 'male' AND d.event_id = $1
		`, eventID); err != nil {
				return errors.WithStack(err)
			}

			if err := sqlx.GetContext(ctx, tx, &stats[i].GirlsCount, `
				SELECT
					COUNT(*)
				FROM registrations r
				LEFT JOIN signups s ON s.registration_id = r.id
				LEFT JOIN days d ON s.day_id = d.id
				WHERE r.gender = 'female' AND d.event_id = $1
		`, eventID); err != nil {
				return errors.WithStack(err)
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return stats, nil
}

func (repo *PostgresRepo) WithTxx(ctx context.Context, f func(context.Context, *sqlx.Tx) error) error {
	tx, err := repo.db.BeginTxx(ctx, nil)
	if err != nil {
		return errors.Wrap(err, "Failed to begin a transaction.")
	}
	if err := f(ctx, tx); err != nil {
		_ = tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return errors.Wrap(err, "Failed to commit a transaction.")
	}
	return nil
}
