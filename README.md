# taqsir

An url shortening microservice. Uses a simple md5 hash and persists using a postgres db.

# setup

Compile the .proto definition with:

```bash

protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    taqsir/taqsir.proto
```

Create an `urls` table following the statements in [init.sql](./taqsir_server/init.sql)

# run

```bash
go run taqsir_server/main.go
```

# test

Use a gRPC client such as [evans](https://github.com/ktr0731/evans) to test locally

```bash
evans --port 50051 --proto taqsir/taqsir.proto
```

```bash
taqsir.UrlShortener@127.0.0.1:50051> call Shorten
original_url (TYPE_STRING) => https://www.wikipedia.org
{
  "shortenedUrl": "856f08"
}
```

# wip

- Use go-routines to create shortened urls.
- Make multiple instances run parallelly.
- Give an option to set an expiry time for shortened urls.
- Restructure repository functions to separate modules
