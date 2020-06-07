package api_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/labstack/echo/v4"

	"github.com/stretchr/testify/suite"
)

type StatsSuite struct {
	CommonSuite
}

func (s *StatsSuite) TestGetStat_OK() {
	event := s.InsertEvent()

	_, err := s.db.Exec(`INSERT INTO days (
		id,
		capacity,
		limit_boys,
		limit_girls,
		description,
		price,
		event_id
	) VALUES (
		12,
		10,
		5,
		5,
		'bla',
		42,
		$1
	)`, event.ID)
	s.Require().NoError(err)

	_, err = s.db.Exec(`INSERT INTO registrations(
		id,
		name,
		surname,
		token,
		gender,
		amount,
		payed,
		finished_school,
		attended_previous,
		city,
		pills,
		notes,
		parent_name,
		parent_surname,
		email,
		phone,
		date_of_birth,
		created_at,
		updated_at
	) VALUES (
		15,
		'sadf',
		'sadf',
		'sadf',
		'female',
		10,
		0,
		'zs',
		true,
		'bb',
		'pills',
		'notest',
		'parentN',
		'parentS',
		'email',
		'phone',
		NOW(),
		NOW(),
		NOW()
	)`)
	s.Require().NoError(err)

	_, err = s.db.Exec(`INSERT INTO signups(
		day_id,
		registration_id,
		state,
		created_at,
		updated_at
	) VALUES (
		12,
		15,
		'sadf',
		NOW(),
		NOW()
	)`)
	s.Require().NoError(err)

	u := fmt.Sprintf("/api/stats/%d", event.ID)
	req, rec := s.NewRequest(http.MethodGet, u, nil)
	s.AssertServerResponseArray(req, rec, http.StatusOK, func(body []interface{}) {
		s.Equal(echo.Map{
			"boys_count":  float64(0),
			"capacity":    float64(10),
			"day_id":      float64(12),
			"event_id":    float64(1),
			"girls_count": float64(1),
			"limit_boys":  float64(5),
			"limit_girls": float64(5),
		}, body)
	})
}

func TestStatsSuite(t *testing.T) {
	suite.Run(t, new(StatsSuite))
}
