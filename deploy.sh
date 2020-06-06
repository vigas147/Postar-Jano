#!/usr/bin/env bash

git pull
docker-compose build --parallel --no-cache && 
docker-compose down && 
docker-compose up -d