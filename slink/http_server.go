package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const (
	HTTP_PORT = "8060"
)

func initHttpServer() {

	type SlinkRequest struct {
		Url string `json:"url"`
	}

	type SlinkResponse struct {
		Url string `json:"url"`
	}
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.POST("/shorten", func(c echo.Context) error {
		slinkyRequest := new(SlinkRequest)
		if err := c.Bind(slinkyRequest); err != nil {
			return err
		}
		slinkyResponse := new(SlinkResponse)
		slinkyResponse.Url = getShortenedUrl(slinkyRequest.Url)

		return c.JSON(http.StatusCreated, slinkyResponse)

	})

	e.POST("/expand", func(c echo.Context) error {
		slinkyRequest := new(SlinkRequest)
		if err := c.Bind(slinkyRequest); err != nil {
			return err
		}
		slinkyResponse := new(SlinkResponse)
		slinkyResponse.Url = getExpandedUrl(slinkyRequest.Url)

		return c.JSON(http.StatusCreated, slinkyResponse)

	})
	e.Logger.Fatal(e.Start(":" + HTTP_PORT))
}
