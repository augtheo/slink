package handlers

import (
	"net/http"

	"github.com/augtheo/slink/models"
	"github.com/augtheo/slink/repository"
	"github.com/augtheo/slink/service"
	"github.com/labstack/echo/v4"
)

// UrlsPost - Add a new URL and receive a shortened URL
func (c *Container) UrlsPost(ctx echo.Context) error {

	urlsPostRequest := new(models.UrlsPostRequest)
	if err := ctx.Bind(urlsPostRequest); err != nil {
		return err
	}
	userId := getJWTSubject(ctx)

	shortenedUrlResponse := new(models.ShortenedUrlResponse)
	shortenedUrlResponse.ShortenedUrl = service.GetShortenedUrl(urlsPostRequest.OriginalUrl, urlsPostRequest.ExpiryDate, userId)
	return ctx.JSON(http.StatusOK, shortenedUrlResponse)
}

// UrlResolve - Resolve a shortened URL and redirect to the original URL
func (c *Container) UrlResolve(ctx echo.Context) error {
	url := ctx.Param("url")
	visitorIp := ctx.RealIP()

	resolvedUrl := service.ResolveShortenedUrl(url, visitorIp)
	return ctx.Redirect(http.StatusPermanentRedirect, resolvedUrl)

}

// UrlsShortenedUrlDelete - Delete or disable a shortened URL
func (c *Container) UrlsShortenedUrlDelete(ctx echo.Context) error {
	shortenedUrl := ctx.Param("shortened_url")
	userId := getJWTSubject(ctx)

	if _, err := repository.DeleteShortenedUrl(shortenedUrl, userId); err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, models.MessageResponse{
		Message: "Successfully Deleted",
	})
}

// UrlsShortenedUrlStatsGet - View stats of the number of visits to the URL
func (c *Container) UrlsShortenedUrlStatsGet(ctx echo.Context) error {
	// TODO: Assert shortened_url was created by user with the user in the JWT subject
	shortenedUrl := ctx.Param("shortened_url")
	userId := getJWTSubject(ctx)

	if urlShortenedStatsResponse, err := repository.GetUrlShortenedStats(shortenedUrl, userId); err != nil {
		return err
	} else {
		return ctx.JSON(http.StatusOK, urlShortenedStatsResponse)
	}
}

// UsersUserIdStatsGet - View the top most popular URLs for a user
func (c *Container) UsersUserIdStatsGet(ctx echo.Context) error {
	userId := getJWTSubject(ctx)

	if userStatsResponse, err := repository.GetUserStats(userId); err != nil {
		return err
	} else {
		return ctx.JSON(http.StatusOK, userStatsResponse)
	}
}

func (c *Container) UsersClickStatsGet(ctx echo.Context) error {

	userId := getJWTSubject(ctx)
	unique := ctx.QueryParam("unique")

	if unique == "true" {
		if data, err := repository.GetLastWeekUniqueVisitStats(userId); err == nil {
			return ctx.JSON(http.StatusOK, models.UserClickStatsResponse{
				Count: int32(repository.GetLastWeekUniqueVisitCountStats(userId)),
				Data:  data,
			})
		} else {
			return err
		}
	} else {

		if data, err := repository.GetLastWeekTotalVisitStats(userId); err == nil {
			return ctx.JSON(http.StatusOK, models.UserClickStatsResponse{
				Count: int32(repository.GetLastWeekTotalVisitCountStats(userId)),
				Data:  data,
			})
		} else {
			return err
		}

	}

}
