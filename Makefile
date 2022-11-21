build-app:
	yarn --silent && yarn build && NODE_ENV=production yarn webpack
build-image:
	docker build . --tag jobs

build: build-app build-image
start:
	docker-compose --project-name jobs -f .docker/docker-compose.yml up -d
stop:
	docker-compose --project-name jobs -f .docker/docker-compose.yml down
