FROM golang:1.15.3 AS builder

ADD https://github.com/chrisaxiom/docker-health-check/blob/master/docker-health-check?raw=true /docker-health-check
RUN chmod a+x /docker-health-check

ENV CGO_ENABLED 0
ENV GOPATH ""

WORKDIR /src
COPY . go.sum /src/
RUN go mod download
COPY . .

RUN make build

FROM scratch
WORKDIR /app
COPY --from=builder /docker-health-check /docker-health-check
COPY --from=builder /etc/ssl/certs /etc/ssl/certs
COPY --from=builder /src/registrations_api /app/bin/registrations_api
CMD ["/app/bin/registrations_api"]
