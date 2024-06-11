FROM openapitools/openapi-generator-cli as gen
WORKDIR /workspace
COPY api/openapi.yaml ./api/openapi.yaml
RUN bash /usr/local/bin/docker-entrypoint.sh generate \
    -i /workspace/api/openapi.yaml \
    -g go-echo-server \
    -o generated/ \
    --additional-properties=packageName=slink \
    --global-property models



FROM golang:1.21 AS build-stage
WORKDIR /app
COPY --from=gen /workspace/generated /app/models

COPY slink ./

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
