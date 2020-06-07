package resources

import "time"

type RegisterReq struct {
	Name             string    `json:"name"`
	Surname          string    `json:"surname"`
	Gender           string    `json:"gender"`
	DateOfBirth      time.Time `json:"date_of_birth"`
	FinishedSchool   string    `json:"finished_school"`
	AttendedPrevious bool      `json:"attended_previous"`
	City             string    `json:"city"`
	Pills            string    `json:"pills"`
	Notes            string    `json:"notes"`
	ParentName       string    `json:"parent_name"`
	ParentSurname    string    `json:"parent_surname"`
	Email            string    `json:"email"`
	Phone            string    `json:"phone"`
	DayIDs           []int     `json:"day_ids"`
}
