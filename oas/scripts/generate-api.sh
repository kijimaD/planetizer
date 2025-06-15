#!/bin/bash

set -eu

cd $(dirname $0);
cd ..

mkdir -p ./api/generated

docker run --rm \
       -v $PWD:/workdir \
       -w /workdir \
       -u "$(id -u):$(id -g)" \
       redocly/cli \
       bundle openapi.yml -o output/openapi.gen.yml

docker run --rm \
       -v $PWD:/workdir \
       -w /workdir \
       -u "$(id -u):$(id -g)" \
       -e XDG_CACHE_HOME=/tmp/.cache \
       golang:1.24-bookworm \
       bash -c "go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.4.1 && \
         oapi-codegen --config config/models.yml output/openapi.gen.yml && \
         oapi-codegen --config config/spec.yml output/openapi.gen.yml"
