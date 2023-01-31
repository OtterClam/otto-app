#!/bin/bash

set -x

PREFIX=$1
SHORT_SHA=$(git rev-parse --short HEAD)
TS=$(date +%s)
TAG=${IMAGE_NAME:-us.gcr.io/otterclam/otter-app}:$PREFIX-$SHORT_SHA-$TS
docker build --platform linux/amd64 -t "$TAG" .
