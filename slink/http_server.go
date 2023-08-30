package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const (
	SERVER_BASE_URL = "localhost"
	HTTP_PORT       = "8060"
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
	e.Use(middleware.CORS())
	e.POST("/shorten", func(c echo.Context) error {
		slinkyRequest := new(SlinkRequest)
		if err := c.Bind(slinkyRequest); err != nil {
			return err
		}
		slinkyResponse := new(SlinkResponse)
		slinkyResponse.Url = fmt.Sprintf("%v:%v/go/%v", SERVER_BASE_URL, HTTP_PORT, getShortenedUrl(slinkyRequest.Url))

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

	e.GET("/go/:url", func(c echo.Context) error {
		url := c.Param("url")
		return c.Redirect(http.StatusPermanentRedirect, getExpandedUrl((url)))
	})

	e.Logger.Fatal(e.Start(":" + HTTP_PORT))
}
