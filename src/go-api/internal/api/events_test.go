package api_test

import (
	"net/http"
	"testing"

	"github.com/labstack/echo/v4"

	"github.com/stretchr/testify/suite"
)

type EventsSuite struct {
	CommonSuite
}

func (s *EventsSuite) TestListEvents_OK() {
	event := s.InsertEvent()

	req, rec := s.NewRequest(http.MethodGet, "/api/events", nil)
	s.AssertServerResponseArray(req, rec, http.StatusOK, func(body []interface{}) {
		s.Equal([]interface{}{
			map[string]interface{}{
				"id":         float64(event.ID),
				"title":      event.Title,
				"owner_name": "John",
			},
		}, body)
	})
}

func (s *EventsSuite) TestFindEvent_NotFound() {
	req, rec := s.NewRequest(http.MethodGet, "/api/events/1", nil)
	s.AssertServerResponseObject(req, rec, http.StatusNotFound, func(body echo.Map) {
		s.Equal(echo.Map{"message": "Not Found"}, body)
	})
}

func (s *EventsSuite) TestFindEvent_OK() {
	event := s.InsertEvent()

	req, rec := s.NewRequest(http.MethodGet, "/api/events/1", nil)
	s.AssertServerResponseObject(req, rec, http.StatusOK, func(body echo.Map) {
		s.Equal(echo.Map{
			"id":          float64(event.ID),
			"title":       event.Title,
			"description": event.Description,
			"date_from":   event.DateFrom,
			"date_to":     event.DateTo,
			"location":    event.Location,
			"min_age":     float64(event.MinAge),
			"max_age":     float64(event.MaxAge),
			"owner_name":  "John",
			"active":      event.Active,
		}, body)
	})
}

func TestEventsSuite(t *testing.T) {
	suite.Run(t, new(EventsSuite))
}
