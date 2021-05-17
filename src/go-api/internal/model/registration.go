package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/lib/pq"
	"github.com/pkg/errors"
)

type Registration struct {
	ID                 int         `json:"id" db:"id"`
	Name               string      `json:"name" db:"name"`
	Surname            string      `json:"surname" db:"surname"`
	Gender             string      `json:"gender" db:"gender"`
	DateOfBirth        time.Time   `json:"date_of_birth" db:"date_of_birth"`
	FinishedSchool     string      `json:"finished_school" db:"finished_school"`
	AttendedPrevious   bool        `json:"attended_previous" db:"attended_previous"`
	AttendedActivities *string     `json:"attended_activities" db:"attended_activities"`
	City               string      `json:"city" db:"city"`
	Pills              *string     `json:"pills" db:"pills"`
	Problems           *string     `json:"problems" db:"problems"`
	Notes              string      `json:"notes" db:"notes"`
	ParentName         string      `json:"parent_name" db:"parent_name"`
	ParentSurname      string      `json:"parent_surname" db:"parent_surname"`
	Email              string      `json:"email" db:"email"`
	Phone              string      `json:"phone" db:"phone"`
	Amount             int         `json:"amount" db:"amount"`
	Payed              *int        `json:"payed" db:"payed"`
	Discount           *int        `json:"discount" db:"discount"`
	AdminNote          string      `json:"admin_note" db:"admin_note"`
	Token              string      `json:"token" db:"token"`
	UpdatedAt          time.Time   `json:"updated_at" db:"updated_at"`
	CreatedAt          time.Time   `json:"created_at" db:"created_at"`
	DeletedAt          pq.NullTime `json:"-" db:"deleted_at"`
}

type ExtendedRegistration struct {
	Registration
	DayNames DayNames `json:"days"     db:"days"`
	EventID  string   `json:"eventID" db:"event_id"`
	Title    *string  `json:"title"    db:"title"`
}

type RegResult struct {
	Token          string `json:"token"`
	Success        bool   `json:"success"`
	RegisteredIDs  []int  `json:"registered_ids"`
	RegisteredDesc []string
	Event          *Event
	Reg            Registration
}

type DayNames []struct {
	ID          int    `json:"id"`
	Description string `json:"description"`
}

func (d DayNames) Value() (driver.Value, error) {
	return json.Marshal(d)
}

func (d *DayNames) Scan(src interface{}) error {
	fmt.Println(string(src.([]byte)))
	source, ok := src.([]byte)
	if !ok {
		return errors.New("source is not []byte")
	}

	return errors.WithStack(json.Unmarshal(source, &d))
}
