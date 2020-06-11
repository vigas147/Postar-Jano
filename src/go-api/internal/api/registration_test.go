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

func (s *StatusSuite) TestRegister_OK() {
	const (
		name    = "dano"
		surname = "zharmanca"
		gender  = "male"
	)
	event := s.InsertEvent()

	u := fmt.Sprintf("/api/registrations/%d", event.ID)
	req, rec := s.NewRequest(http.MethodPost, u, echo.Map{
		"child": echo.Map{
			"name":    name,
			"surname": surname,
			"gender":  gender,
		},
		"days": []interface{}{5},
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
		PhotoURL:      "photo",
		Sum:           12,
		Owner:         "John Doe",
		Text:          "132456 email@example.com",
		Days:          []string{"desc"},
	}).Return(nil)

	s.AssertServerResponseObject(req, rec, http.StatusOK, func(body echo.Map) {
		s.NotEmpty(body["token"])
		delete(body, "token")
		s.Equal(echo.Map{
			"registeredIDs": []interface{}{float64(5)},
			"success":       true,
		}, body)
	})
}

func TestRegistrationSuite(t *testing.T) {
	suite.Run(t, new(RegistrationSuite))
}
