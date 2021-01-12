#!/bin/bash

if [ "$#" != "2" ]; then
    echo "usage: deploy [module] [dir]"
    exit 255
fi


theModule="$1"
theDir="$2"

npm run dev:${theModule}
npm run build:${theModule}

rsync -zah build/ ${theDir}
