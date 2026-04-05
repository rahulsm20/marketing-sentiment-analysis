#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set"
  exit 1
fi

cd "$ROOT_DIR/ts-packages" && bunx drizzle-kit generate && cd "$ROOT_DIR"

cd "$ROOT_DIR/py_packages" && uv run sqlacodegen "$DATABASE_URL" \
  --generator sqlmodels \
  --outfile py_packages/lib/models.py
