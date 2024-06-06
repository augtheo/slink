# slink

An url shortening application. Uses a simple md5 hash and persists using a postgres db.

The compose file defines an application with a go service and a postgres db.

# build

Build client and server stubs with

```bash
openapi-generator-cli generate -i api/openapi.yaml -g typescript-axios -o slink-web/generated-src --additional-properties=supportsES6=true,typescriptThreePlus=true
openapi-generator-cli generate -i api/openapi.yaml -g go-echo-server -o slink/ --additional-properties=packageName=slink --global-property models
```

Set the following environment variables within `slink-web/.env.development`:

    - `VITE_APP_API_URL`

    - `VITE_CLERK_PUBLISHABLE_KEY`

Set the public key used to verify the signed JWT in `slink/resource/clerk_dev.pem`

```bash
docker compose -f docker-compose.yml -f docker-compose-dev.yml build
```

# run

```bash
docker compose -f docker-compose.yml -f docker-compose-dev.yml up -d
```

# roadmap

## done

- [x] Restructure repository functions to separate modules
- [x] Cache recently resolved urls
- [x] Give an option to set an expiry time for shortened urls.
- [x] Add db migrations

## wip

- [ ] Use base 58 encoded URLs
- [ ] Remove expired urls from cache
- [ ] Allow shortened URLs to be deactivated
- [ ] Add authentication and personalised services.

## hmm

- [ ] Roll my own auth
