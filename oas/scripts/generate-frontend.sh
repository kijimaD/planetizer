#!/bin/bash
set -eux

###########
# comment
###########

cd `dirname $0`
cd ..

docker run --rm \
       -v $PWD:/workdir \
       -w /workdir \
       -u "$(id -u):$(id -g)" \
       openapitools/openapi-generator-cli:v7.11.0 generate \
         -i openapi.yml \
         -g typescript-axios \
         -o output/ts-axios

mkdir -p generated
mv output/ts-axios/*.ts generated/
