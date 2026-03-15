#!/bin/bash
cd ts-packages && bunx drizzle-kit migrate && bunx drizzle-kit generate && ../scripts/generate_models.sh