#!/usr/bin/env bash

git pull
# docker-compose pull
docker-compose build --parallel
docker-compose down
docker-compose up -d