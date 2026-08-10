#!/usr/bin/env bash

docker build -f Dockerfile.mysql-no-volume . -t mysql:5.7-no-volumes
docker push ghcr.io/boxedout/mysql:5.7-no-volumes
