package api

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/MarekVigas/Postar-Jano/internal/resources"

	"github.com/pkg/errors"

	"github.com/MarekVigas/Postar-Jano/internal/mailer"
	"github.com/MarekVigas/Postar-Jano/internal/repository"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

type API struct {
	*echo.Echo
	repo   *repository.PostgresRepo
	logger *zap.Logger
	mailer *mailer.Client
}

func New(logger *zap.Logger, db *sql.DB, mailer *mailer.Client) *API {
	e := echo.New()
	a := &API{Echo: e, repo: repository.NewPostgresRepo(db), logger: logger, mailer: mailer}

	api := e.Group("/api", middleware.Recover(), middleware.LoggerWithConfig(middleware.LoggerConfig{
		Skipper: func(c echo.Context) bool {
			if c.Request().URL.Path == "/api/stats" {
				return true
			}
			return false
		},
	}))
	api.GET("/status", a.Status)

	api.POST("/registrations/:id", a.Register)

	api.GET("/stats", a.ListStats)
	api.GET("/stats/:id", a.StatByID)

	api.GET("/events", a.ListEvents)
	api.GET("/events/:id", a.EventByID)

	// TODO: will be delivered after Sunday :)
	api.GET("/registrations/:token", a.FindRegistration)

	api.POST("/api/sign/in", a.SignIn)
	api.GET("/registrations", a.ListRegistrations)
	api.PUT("/registrations/:id", a.UpdateRegistration)

	return a
}

func (api *API) Status(c echo.Context) error {
	if err := api.repo.Ping(c.Request().Context()); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"status": "err"})
	}
	return c.JSON(http.StatusOK, echo.Map{"status": "ok"})
}

func (api *API) ListStats(c echo.Context) error {
	return nil
}

func (api *API) StatByID(c echo.Context) error {
	ctx := c.Request().Context()

	id, err := api.getID(c.Param("id"))
	if err != nil {
		return err
	}

	stats, err := api.repo.GetStat(ctx, id)
	if err != nil {
		api.Logger.Error("failed to list stats", zap.Error(err))
		return err
	}

	return c.JSON(http.StatusOK, stats)
}

func (api *API) Register(c echo.Context) error {
	ctx := c.Request().Context()

	var req resources.RegisterReq

	if err := c.Bind(&req); err != nil {
		return err
	}

	// TODO: Validate input

	reg, err := api.repo.Register(ctx, &req)
	if err != nil {
		api.logger.Error("Failed to create a registration", zap.Error(err))
		return err
	}

	// Send confirmation mail

	return c.JSON(http.StatusOK, echo.Map{
		"name":    reg.Name,
		"surname": reg.Surname,
		"token":   reg.Token,
	})
}

func (api *API) ListRegistrations(c echo.Context) error {
	return nil
}

func (api *API) FindRegistration(c echo.Context) error {
	return nil
}

func (api *API) ListEvents(c echo.Context) error {
	ctx := c.Request().Context()

	events, err := api.repo.ListEvents(ctx)
	if err != nil {
		api.Logger.Error("Failed to list events.", zap.Error(err))
		return err
	}
	return c.JSON(http.StatusOK, events)
}

func (api *API) EventByID(c echo.Context) error {
	ctx := c.Request().Context()

	id, err := api.getID(c.Param("id"))
	if err != nil {
		return err
	}

	event, err := api.repo.FindEvent(ctx, id)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return echo.ErrNotFound
		}
		api.Logger.Error("Failed to find event.", zap.Error(err), zap.Int("event_id", id))
		return err
	}
	return c.JSON(http.StatusOK, event)
}

func (api *API) SignIn(c echo.Context) error {
	return nil
}

func (api *API) UpdateRegistration(c echo.Context) error {
	return nil
}

func (api *API) getID(param string) (int, error) {
	id, err := strconv.ParseInt(param, 10, 32)
	if err != nil {
		return 0, echo.ErrBadRequest
	}
	return int(id), nil
}
