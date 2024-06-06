FROM golang:1.21 AS build-stage
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./
COPY handlers ./handlers
COPY models ./models
COPY repository ./repository
COPY resources ./resources
COPY service ./service

RUN CGO_ENABLED=0 GOOS=linux go build -o /slink


# Run the tests in the container
FROM build-stage AS run-test-stage
RUN go test -v ./...


# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage
WORKDIR /
COPY --from=build-stage /slink /slink
EXPOSE 8060
USER nonroot:nonroot
ENTRYPOINT ["/slink"]
