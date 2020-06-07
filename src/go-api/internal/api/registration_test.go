package api_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/suite"
)

type RegistrationSuite struct {
	CommonSuite
}

func (s *StatusSuite) TestRegister_OK() {
	const (
		name    = "dano"
		surname = "zharmanca"
	)
	event := s.InsertEvent()

	u := fmt.Sprintf("/api/registrations/%d", event.ID)
	req, rec := s.NewRequest(http.MethodPost, u, echo.Map{
		"name":    name,
		"surname": surname,
	})
	s.AssertServerResponseObject(req, rec, http.StatusOK, func(body echo.Map) {
		s.NotEmpty(body["token"])
		delete(body, "token")
		s.Equal(echo.Map{
			"name":    name,
			"surname": surname,
		}, body)
	})
}

func TestRegistrationSuite(t *testing.T) {
	suite.Run(t, new(RegistrationSuite))
}
