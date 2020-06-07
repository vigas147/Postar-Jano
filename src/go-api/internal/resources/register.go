package resources

import "time"

type RegisterReq struct {
	Child struct {
		Name             string    `json:"name"`
		Surname          string    `json:"surname"`
		Gender           string    `json:"gender"`
		DateOfBirth      time.Time `json:"dateOfBirth"`
		FinishedSchool   string    `json:"finishedSchoolYear"`
		AttendedPrevious bool      `json:"attendedPreviousEvents"`
		City             string    `json:"city"`
	} `json:"child"`

	Medicine struct {
		Pills string `json:"drugs"`
	} `json:"medicine"`

	Health struct {
		Problems string `json:"problems"`
	} `json:"health"`

	Parent struct {
		Name    string `json:"name"`
		Surname string `json:"surname"`
		Email   string `json:"email"`
		Phone   string `json:"phone"`
	} `json:"parent"`

	Membership struct {
		AttendedActivities string `json:"attendedActivities"`
	} `json:"memberShip"`
	Notes  string `json:"notes"`
	DayIDs []int  `json:"days"`
}
