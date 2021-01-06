#!/bin/bash

if [ "$1" == "" ]; then
    echo "usage: deploy_all [dir]"
    exit 255
fi

theDir="$1"

modules=("home" "user-info" "change-passwd")

for each in ${modules[@]}; do
    echo "module: ${each}"
    npm run dev:${each}
    npm run build:${each}
    ./scripts/deploy.sh "${theDir}"
done
