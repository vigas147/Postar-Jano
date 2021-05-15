package api_test

import (
	"context"
	"fmt"
	"net/http"
	"testing"

	"github.com/MarekVigas/Postar-Jano/internal/model"

	"github.com/stretchr/testify/suite"
)

type StatsSuite struct {
	CommonSuite
}

func (s *StatsSuite) TestGetStat_OK() {
	ctx := context.Background()
	event := s.InsertEvent()

	dayOne := event.Days[0]
	dayTwo := model.Day{
		Description: "bla",
		Capacity:    10,
		LimitBoys:   s.intRef(5),
		LimitGirls:  nil,
		Price:       42,
		EventID:     event.ID,
	}
	s.Require().NoError((&dayTwo).Create(ctx, s.dbx))

	_, err := s.db.Exec(`INSERT INTO registrations(
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
		$1,
		15,
		'sadf',
		NOW(),
		NOW()
	)`, dayTwo.ID)
	s.Require().NoError(err)

	u := fmt.Sprintf("/api/stats/%d", event.ID)
	req, rec := s.NewRequest(http.MethodGet, u, nil)
	s.AssertServerResponseArray(req, rec, http.StatusOK, func(body []interface{}) {
		s.Equal([]interface{}{
			s.dayToResponse(&dayOne, 0, 0),
			s.dayToResponse(&dayTwo, 0, 1),
		}, body)
	})
}

func (s *StatsSuite) dayToResponse(d *model.Day, boysCount int, girlsCount int) map[string]interface{} {
	res := map[string]interface{}{
		"boys_count":  float64(boysCount),
		"girls_count": float64(girlsCount),
		"capacity":    float64(d.Capacity),
		"day_id":      float64(d.ID),
		"event_id":    float64(d.EventID),
		"limit_boys":  nil,
		"limit_girls": nil,
	}
	if d.LimitGirls != nil {
		res["limit_girls"] = float64(*d.LimitGirls)
	}
	if d.LimitBoys != nil {
		res["limit_boys"] = float64(*d.LimitBoys)
	}
	return res
}

func TestStatsSuite(t *testing.T) {
	suite.Run(t, new(StatsSuite))
}
