package api_test

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"

	"github.com/MarekVigas/Postar-Jano/internal/model"

	"github.com/MarekVigas/Postar-Jano/internal/mailer"

	"github.com/MarekVigas/Postar-Jano/internal/api"
	"github.com/MarekVigas/Postar-Jano/internal/db"
	"github.com/MarekVigas/Postar-Jano/internal/repository"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

const loggingEnabled = false

type CommonSuite struct {
	suite.Suite
	logger *zap.Logger

	api    *api.API
	db     *sql.DB
	mailer *mailer.Client
}

func (s *CommonSuite) SetupSuite() {
	var err error

	if loggingEnabled {
		s.logger, err = zap.NewDevelopment()
		s.Require().NoError(err)
	} else {
		s.logger = zap.NewNop()
	}

	s.db, err = db.Connect()
	s.Require().NoError(err)

	s.mailer, err = mailer.NewClient(s.logger)

	// Create db schema.
	s.db.Exec(`drop schema public cascade;
create schema public;`)
	schema, err := os.Open("../../../../db/init.sql")
	s.Require().NoError(err)
	dbData, err := ioutil.ReadAll(schema)
	s.Require().NoError(err)
	_, err = s.db.Exec(string(dbData))
	s.Require().NoError(err)
}

func (s *CommonSuite) TearDownSuite() {
	_ = s.db.Close()
	_ = s.logger.Sync()
}

func (s *CommonSuite) SetupTest() {
	ctx := context.Background()
	s.api = api.New(
		s.logger,
		s.db,
		s.mailer,
	)
	s.NoError(repository.Reset(ctx, s.db))
}

func (s *CommonSuite) AssertServerResponseObject(
	req *http.Request,
	rec *httptest.ResponseRecorder,
	expectedStatus int,
	checkBody func(echo.Map),
) {
	s.api.ServeHTTP(rec, req)
	if !s.Equal(expectedStatus, rec.Code) {
		s.T().Log("Response body:\n", rec.Body.String())
		return
	}
	if checkBody != nil {
		var body echo.Map
		if s.NoError(json.NewDecoder(rec.Body).Decode(&body)) {
			checkBody(body)
		}
	}
}

func (s *CommonSuite) NewRequest(
	method string,
	target string,
	body interface{},
) (*http.Request, *httptest.ResponseRecorder) {

	var bodyReader io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if s.NoError(err) {
			bodyReader = bytes.NewReader(b)
		}
	}

	req := httptest.NewRequest(method, target, bodyReader)
	if body != nil {
		req.Header.Add(echo.HeaderContentType, echo.MIMEApplicationJSON)
	}
	rec := httptest.NewRecorder()
	return req, rec
}

func (s *CommonSuite) AssertServerResponseArray(
	req *http.Request,
	rec *httptest.ResponseRecorder,
	expectedStatus int,
	checkBody func([]interface{}),
) {
	s.api.ServeHTTP(rec, req)
	if !s.Equal(expectedStatus, rec.Code) {
		s.T().Log("Response body:\n", rec.Body.String())
		return
	}
	if checkBody != nil {
		var body []interface{}
		if s.NoError(json.NewDecoder(rec.Body).Decode(&body)) {
			checkBody(body)
		}
	}
}

func (s *CommonSuite) InsertEvent() *model.Event {
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

	return &event
}
