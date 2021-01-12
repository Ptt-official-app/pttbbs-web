#!/bin/bash

if [ "$1" == "" ]; then
    echo "usage: deploy_all [dir]"
    exit 255
fi

theDir="$1"

modules=("home" "user-info" "change-passwd" "attempt-change-email" "change-email" "attempt-set-id-email" "set-id-email")

for each in ${modules[@]}; do
    echo "module: ${each}"
    ./scripts/deploy.sh "${each}" "${theDir}"
done
