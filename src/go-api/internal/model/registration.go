package model

import "time"

type Registration struct {
	ID               int       `json:"id" db:"id"`
	Name             string    `json:"name" db:"name"`
	Surname          string    `json:"surname" db:"surname"`
	Gender           string    `json:"gender" db:"gender"`
	DateOfBirth      time.Time `json:"date_of_birth" db:"date_of_birth"`
	FinishedSchool   string    `json:"finished_school" db:"finished_school"`
	AttendedPrevious bool      `json:"attended_previous" db:"attended_previous"`
	City             string    `json:"city" db:"city"`
	Pills            string    `json:"pills" db:"pills"`
	Notes            string    `json:"notes" db:"notes"`
	ParentName       string    `json:"parent_name" db:"parent_name"`
	ParentSurname    string    `json:"parent_surname" db:"parent_surname"`
	Email            string    `json:"email" db:"email"`
	Phone            string    `json:"phone" db:"phone"`
	Amount           int       `json:"amount" db:"amount"`
	Payed            *int      `json:"payed" db:"payed"`
	Token            string    `json:"token" db:"token"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

type RegResult struct {
	Token         string `json:"token"`
	Success       bool   `json:"success"`
	RegisteredIDs []int  `json:"registered_ids"`
}
