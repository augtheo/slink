# setup

Compile the .proto definition with:

```bash

protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/slink.proto
```

Create an `urls` table following the statements in [init.sql](./slink_server/init.sql)

# run

```bash
go run main.go
```

# test

Use a gRPC client such as [evans](https://github.com/ktr0731/evans) to test locally

```bash
evans --port 50051 --proto proto/slink.proto
```

```bash
slink.UrlShortener@127.0.0.1:50051> call Shorten
original_url (TYPE_STRING) => https://www.wikipedia.org
{
  "shortenedUrl": "856f08"
}
```

# roadmap

- [x] Restructure repository functions to separate modules

# wip

- [ ] Use go-routines to create shortened urls.
- [ ] Make multiple instances run parallelly.
- [ ] Give an option to set an expiry time for shortened urls.
