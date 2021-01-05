#!/bin/bash

if [ "$1" == "" ]; then
    echo "usage: deploy [dir]"
    exit 255
fi

theDir="$1"

rsync -zah build/ ${theDir}
