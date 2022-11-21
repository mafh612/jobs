# jobs

## run with make
### build
> `make build`

### run
> `make start`

### shutdown
> `make stop`
## run without make
### build image
> docker build . --tag jobs
### run
> docker-compose --project-name jobs -f .docker/docker-compose.yml up -d
### stop
> docker-compose --project-name jobs -f .docker/docker-compose.yml down

## using
### access openapi documentation
> http://localhost:3000
### run test
> yarn test:it

a test covering the following scenarios
- Test A
  - Employer register
  - Employer login
  - Employer creates Job
  - Employer updates Job
  - Employer deletes Job
- Test B
  - Employer register
  - Employer login
  - Employer creates Job
  - Employee register
  - Employee login
  - Employee creates Job - failed
  - Employee updates Job - failed
  - Employee deletes Job - failed
  - Employee creates Negotiation
  - Employee updates Negotiation
  - Employer updates Negotiation
  - Employee updates Negotiation again
