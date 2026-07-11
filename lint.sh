#!/bin/bash

set -e

for package in */; do
    echo "Linting $package..."
    cd "$package"

    if npm run | grep -q "^  lint"; then
        npm run lint
    else
        echo "Skipping $package (no lint script)"
    fi

    cd ..
done