package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func initHttpServer() {

	var (
		SLINK_URL   = os.Getenv("SLINK_URL")
		SERVER_PORT = os.Getenv("SERVER_PORT")
	)
	type SlinkRequest struct {
		Url        string `json:"url"`
		ExpiryDate string `json:"expiry_date"`
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
		slinkyResponse.Url = fmt.Sprintf("%v/go/%v", SLINK_URL, getShortenedUrl(slinkyRequest.Url, slinkyRequest.ExpiryDate))

		return c.JSON(http.StatusCreated, slinkyResponse)

	})

  //TODO:  Use /:url
	e.GET("/go/:url", func(c echo.Context) error {
		url := c.Param("url")
    original_url := getExpandedUrl(url)
    if original_url == "" {
      return c.Redirect(http.StatusPermanentRedirect, fmt.Sprintf("%v/error", SLINK_URL))
    } else {
      return c.Redirect(http.StatusPermanentRedirect, original_url)
    }
	})

	e.Logger.Fatal(e.Start(":" + SERVER_PORT))
}
