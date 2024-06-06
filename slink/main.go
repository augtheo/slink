package main

import (
	"github.com/augtheo/slink/handlers"
	"github.com/golang-jwt/jwt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	rsaPubKey := loadRSAPublicKey()

	c, _ := handlers.NewContainer()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Unsecured endpoints
	e.GET("/:url", c.UrlResolve)

	// Secured endpoints
	g := e.Group("/api")

	key, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(rsaPubKey))
	jwtMiddleware := middleware.JWTWithConfig(middleware.JWTConfig{
		SigningMethod: "RS256",
		SigningKey:    key,
	})
	g.Use(jwtMiddleware)

	g.POST("/urls", c.UrlsPost)

	g.DELETE("/urls/:shortened_url", c.UrlsShortenedUrlDelete)

	g.GET("/urls/:shortened_url/stats", c.UrlsShortenedUrlStatsGet)

	g.GET("/users/urls/stats", c.UsersUserIdStatsGet)

	g.GET("/users/clicks/stats", c.UsersClickStatsGet)

	e.Logger.Fatal(e.Start(":8060"))

}
