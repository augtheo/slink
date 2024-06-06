package handlers

import (
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

// Helper function to extract the subject from JWT
func getJWTSubject(c echo.Context) string {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	subject := claims["sub"].(string)
	return subject
}
