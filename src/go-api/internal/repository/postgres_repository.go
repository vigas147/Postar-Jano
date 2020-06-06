package repository

import (
	"context"
	"database/sql"
	"fmt"

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
