package api_test

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"testing"

	"github.com/MarekVigas/Postar-Jano/internal/model"

	"github.com/stretchr/testify/suite"
)

type EventsSuite struct {
	CommonSuite
}

func (s *EventsSuite) TestListEvents_OK() {
	_, err := s.db.Exec(`
		INSERT INTO owners (
			id,
			name,
			surname,
			username,
			pass,
			email,
			phone
		) VALUES (
			1,
		 	'John',
		 	'Doe',
		 	'jdoe',
		 	'pass123',
		 	'email@example.com',
		 	'132456'
		)`)
	s.Require().NoError(err)

	event := model.Event{
		ID:        1,
		Name:      "Camp 42",
		OwnerName: "John",
	}

	_, err = s.db.Exec(`
		INSERT INTO events (
			id,
			name,
			owner_id,
			description,
			date,
			place,
			min_age,
			max_age,
			info
		) VALUES (
			$1,
		 	$2,
		 	1,
		 	'Lorem ipsum',
		 	'15-16june 2020',
		 	'somewhere',
		 	10,
		 	15,
		 	'xyz ...'
		)`, event.ID, event.Name)
	s.Require().NoError(err)

	req, rec := s.NewRequest(http.MethodGet, "/api/events", nil)
	s.AssertServerResponseArray(req, rec, http.StatusOK, func(body []interface{}) {
		s.Equal([]interface{}{
			map[string]interface{}{
				"id":         float64(event.ID),
				"name":       event.Name,
				"owner_name": "John",
			},
		}, body)
	})
}

func (s *EventsSuite) TestFindEvent_OK() {
	_, err := s.db.Exec(`
		INSERT INTO owners (
			id,
			name,
			surname,
			username,
			pass,
			email,
			phone
		) VALUES (
			1,
		 	'John',
		 	'Doe',
		 	'jdoe',
		 	'pass123',
		 	'email@example.com',
		 	'132456'
		)`)
	s.Require().NoError(err)

	event := model.Event{
		ID:        1,
		Name:      "Camp 42",
		OwnerName: "John",
	}

	_, err = s.db.Exec(`
		INSERT INTO events (
			id,
			name,
			owner_id,
			description,
			date,
			place,
			min_age,
			max_age,
			info
		) VALUES (
			$1,
		 	$2,
		 	1,
		 	'Lorem ipsum',
		 	'15-16june 2020',
		 	'somewhere',
		 	10,
		 	15,
		 	'xyz ...'
		)`, event.ID, event.Name)
	s.Require().NoError(err)

	req, rec := s.NewRequest(http.MethodGet, "/api/events/1", nil)
	s.AssertServerResponseObject(req, rec, http.StatusOK, func(body echo.Map) {
		s.Equal(echo.Map{
			"id":         float64(event.ID),
			"name":       event.Name,
			"owner_name": "John",
		}, body)
	})
}

func TestEventsSuite(t *testing.T) {
	suite.Run(t, new(EventsSuite))
}
