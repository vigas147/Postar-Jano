FROM golang:1.14.4 AS builder

ENV CGO_ENABLED 0
ENV GOPATH ""

WORKDIR /src
COPY . go.sum /src/
RUN go mod download
COPY . .

RUN make build

FROM scratch
WORKDIR /app
COPY --from=builder /src/registrations_api /app/bin/registrations_api
CMD ["/app/bin/registrations_api"]
