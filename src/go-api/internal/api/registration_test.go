package api_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/MarekVigas/Postar-Jano/internal/mailer/templates"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type RegistrationSuite struct {
	CommonSuite
}

func (s *RegistrationSuite) TestRegister_OK() {
	const (
		name    = "dano"
		surname = "zharmanca"
		gender  = "male"
	)
	event := s.InsertEvent()

	day := event.Days[0]

	u := fmt.Sprintf("/api/registrations/%d", event.ID)
	req, rec := s.NewRequest(http.MethodPost, u, echo.Map{
		"child": echo.Map{
			"name":    name,
			"surname": surname,
			"gender":  gender,
		},
		"days": []interface{}{day.ID},
	})
	s.mailer.On("ConfirmationMail", mock.Anything, &templates.ConfirmationReq{
		Mail:          "",
		ParentName:    "",
		ParentSurname: "",
		EventName:     event.Title,
		Name:          name,
		Surname:       surname,
		Pills:         "",
		Restrictions:  "",
		Info:          "",
		PhotoURL:      event.OwnerPhoto,
		Sum:           12,
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
}

func TestRegistrationSuite(t *testing.T) {
	suite.Run(t, new(RegistrationSuite))
}
