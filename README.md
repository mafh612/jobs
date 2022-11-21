# jobs

## run with make
### build
> `make build`

### run
> `make start`

### shutdown
> `make stop`
# jobs

## run without make

### build image
> docker build . --tag jobs

### run
> docker-compose --project-name jobs -f .docker/docker-compose.yml up -d

### stop
> docker-compose --project-name jobs -f .docker/docker-compose.yml down
