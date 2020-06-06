package api

import (
	"database/sql"
	"net/http"

	"github.com/MarekVigas/Postar-Jano/internal/mailer"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type API struct {
	*echo.Echo
	db     *sql.DB
	logger *zap.Logger
	mailer *mailer.Client
}

func New(logger *zap.Logger, db *sql.DB, mailer *mailer.Client) *API {
	e := echo.New()
	a := &API{Echo: e, db: db, logger: logger, mailer: mailer}

	api := e.Group("/api")
	api.GET("/status", a.Status)

	api.POST("/registrations/:id", a.Register)
	api.GET("/registrations/:token", a.FindRegistration)

	api.GET("/stats", a.ListStats)
	api.GET("/stats/:id", a.StatByID)

	api.GET("/events", a.ListEvents)
	api.GET("/events/:id", a.EventByID)

	//TODO: remove testing only
	api.POST("/send", a.Send)

	// TODO: will be delivered after Sunday :)
	api.POST("/api/sign/in", a.SignIn)
	api.GET("/registrations", a.ListRegistrations)
	api.PUT("/registrations/:id", a.UpdateRegistration)

	return a
}

func (api *API) Status(c echo.Context) error {
	if err := api.db.PingContext(c.Request().Context()); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"status": "err"})
	}
	return c.JSON(http.StatusOK, echo.Map{"status": "ok"})
}

func (api *API) Send(c echo.Context) error {
	ctx := c.Request().Context()
	if err := api.mailer.InfoMail(ctx); err != nil {
		api.Logger.Error("Failed to send a mail.", zap.Error(err))
		return echo.ErrInternalServerError
	}
	return c.JSON(http.StatusOK, echo.Map{"msg": "E-mail sent."})
}

func (api *API) ListStats(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{"value": 42})
}

func (api *API) StatByID(c echo.Context) error {
	return nil
}

func (api *API) Register(c echo.Context) error {
	return nil
}

func (api *API) ListRegistrations(c echo.Context) error {
	return nil
}

func (api *API) FindRegistration(c echo.Context) error {
	return nil
}

func (api *API) ListEvents(c echo.Context) error {
	return nil
}

func (api *API) EventByID(c echo.Context) error {
	return nil
}

func (api *API) SignIn(c echo.Context) error {
	return nil
}

func (api *API) UpdateRegistration(c echo.Context) error {
	return nil
}
