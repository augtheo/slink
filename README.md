# slink

An url shortening microservice. Uses a simple md5 hash and persists using a postgres db.

The compose file defines an application with a go service and a postgres db. To run the service in isolation without any additional containers, refer [README](slink/README.md)

# build

```bash
export $(cat .env.dev | xargs) && docker compose build
```

# run

```bash
export $(cat .env.dev | xargs) && docker compose up -d
```
