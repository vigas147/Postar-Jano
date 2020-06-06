package db

import (
	"bytes"
	"database/sql"
	"fmt"
	"os"

	"github.com/pkg/errors"
)

func Connect() (*sql.DB, error) {
	conn, err := connectionString()
	if err != nil {
		return nil, err
	}
	db, err := sql.Open("postgres", conn)
	if err != nil {
		return nil, errors.Wrap(err, "failed to open database")
	}
	return db, nil
}

func connectionString() (string, error) {
	var b bytes.Buffer
	add := func(envVar string, key string) error {
		val := os.Getenv(envVar)
		if val == "" {
			return errors.New(fmt.Sprintf("Missing %s value", envVar))
		}
		fmt.Fprintf(&b, "%s=%v ", key, val)
		return nil
	}

	if err := add("POSTGRES_USER", "user"); err != nil {
		return "", err
	}

	if err := add("POSTGRES_PASSWORD", "password"); err != nil {
		return "", err
	}

	if err := add("POSTGRES_HOST", "host"); err != nil {
		return "", err
	}

	if err := add("POSTGRES_PORT", "port"); err != nil {
		return "", err
	}

	if err := add("POSTGRES_DB", "dbname"); err != nil {
		return "", err
	}

	fmt.Fprint(&b, "sslmode=disable")

	return b.String(), nil
}
