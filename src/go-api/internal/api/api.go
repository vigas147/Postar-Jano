package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type API struct {
	*echo.Echo
}

func New() *API {
	e := echo.New()
	a := &API{Echo: e}

	api := e.Group("/api")
	api.GET("/stats", a.ListStats)

	return a
}

func (api *API) ListStats(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{"value": 42})
}
