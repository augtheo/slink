# slink

An url shortening application. Uses a simple md5 hash and persists using a postgres db.

The compose file defines an application with a go service and a postgres db.

# build

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

## wip

- [ ] Use base 58 encoded URLs

## hmm

- [ ] Add authentication and personalised services.
