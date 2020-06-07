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
	if err := sqlx.SelectContext(ctx, repo.db, &events, `
		SELECT 
			ev.id,
			ev.name,
			o.name AS owner_name
		FROM events ev
		LEFT JOIN owners o ON o.id = ev.owner_id
	`); err != nil {
		return nil, errors.WithStack(err)
	}

	return events, nil
}

func (repo *PostgresRepo) FindEvent(ctx context.Context, id int) (*model.Event, error) {
	var event model.Event
	if err := sqlx.GetContext(ctx, repo.db, &event, `
		SELECT 
			ev.id,
			ev.name,
			o.name AS owner_name
		FROM events ev
		LEFT JOIN owners o ON o.id = ev.owner_id
		WHERE ev.id = $1
	`, id); err != nil {
		return nil, errors.WithStack(err)
	}

	return &event, nil
}

func (repo *PostgresRepo) Register(ctx context.Context, req *resources.RegisterReq) (*model.Registration, error) {
	token, err := uuid.NewUUID()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	var reg model.Registration
	if err := repo.WithTxx(ctx, func(ctx context.Context, tx *sqlx.Tx) error {
		// Insert into registrations/
		err := repo.db.GetContext(ctx, &reg, `
			INSERT INTO registrations(
				name,
				surname,
				token,
				created_at,
				updated_at
			) VALUES (
				$1,
				$2,
				$3,
				NOW(),
				NOW()
			) RETURNING *
		`, req.Name, req.Surname, token.String())
		if err != nil {
			return errors.Wrap(err, "failed to create a registration")
		}

		// Insert into signups

		// Check signups state
		return nil
	}); err != nil {
		return nil, err
	}

	return &reg, nil
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
