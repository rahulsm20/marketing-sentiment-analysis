#!/bin/bash

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set"
  exit 1
fi

cd ts-packages && bunx drizzle-kit generate && cd ../

sqlacodegen "$DATABASE_URL" \
  --generator sqlmodels \
  --outfile py-packages/lib/models.py
