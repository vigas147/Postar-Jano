package api_test

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/MarekVigas/Postar-Jano/internal/mailer/templates"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type RegistrationSuite struct {
	CommonSuite
}

func (s *RegistrationSuite) TestRegister_UnprocessableEntity() {
	event := s.InsertEvent()

	u := fmt.Sprintf("/api/registrations/%d", event.ID)
	req, rec := s.NewRequest(http.MethodPost, u, nil)

	s.AssertServerResponseObject(req, rec, http.StatusUnprocessableEntity, func(body echo.Map) {
		s.Equal(echo.Map{
			"errors": map[string]interface{}{
				"child.name":               "missing",
				"child.surname":            "missing",
				"child.city":               "missing",
				"child.dateOfBirth":        "missing",
				"child.finishedSchoolYear": "missing",
				"child.gender":             "invalid",
				"parent.email":             "invalid",
				"parent.name":              "missing",
				"parent.surname":           "missing",
				"parent.phone":             "missing",
				"days":                     "missing",
			},
		}, body)
	})
}

func (s *RegistrationSuite) TestRegister_OK() {
	const (
		name     = "dano"
		surname  = "zharmanca"
		pname    = "janko"
		psurname = "hrasko"
		gender   = "male"
		city     = "BB"
		phone    = "+421"
		email    = "dano@mail.sk"
		school   = "3.ZS"
	)
	event := s.InsertEvent()

	day := event.Days[0]

	birth := time.Now().Format(time.RFC3339)

	u := fmt.Sprintf("/api/registrations/%d", event.ID)
	req, rec := s.NewRequest(http.MethodPost, u, echo.Map{
		"child": echo.Map{
			"name":               name,
			"surname":            surname,
			"gender":             gender,
			"city":               city,
			"finishedSchoolYear": school,
			"dateOfBirth":        birth,
		},
		"parent": echo.Map{
			"name":    pname,
			"surname": psurname,
			"email":   email,
			"phone":   phone,
		},
		"days": []interface{}{day.ID},
	})
	s.mailer.On("ConfirmationMail", mock.Anything, &templates.ConfirmationReq{
		Mail:          email,
		ParentName:    pname,
		ParentSurname: psurname,
		EventName:     event.Title,
		Name:          name,
		Surname:       surname,
		Pills:         "",
		Restrictions:  "",
		Info:          "",
		PhotoURL:      event.OwnerPhoto,
		Sum:           day.Price,
		Owner:         "John Doe",
		Text:          event.OwnerPhone + " " + event.OwnerEmail,
		Days:          []string{day.Description},
	}).Return(nil)

	s.AssertServerResponseObject(req, rec, http.StatusOK, func(body echo.Map) {
		s.NotEmpty(body["token"])
		delete(body, "token")
		s.Equal(echo.Map{
			"registeredIDs": []interface{}{float64(day.ID)},
			"success":       true,
		}, body)
	})
	//TODO: assert DB content
}

func TestRegistrationSuite(t *testing.T) {
	suite.Run(t, new(RegistrationSuite))
}
