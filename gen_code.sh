#!/bin/bash
npm install -g @openapitools/openapi-generator-cli &&
openapi-generator-cli generate -i shared/db_service.yaml -g python -o ./generation-service/app/db_service --package-name=db_service_client &&
openapi-generator-cli generate -i shared/storage_service.yaml -g python -o ./generation-service/app/storage_service --package-name=storage_service_client &&
openapi-generator-cli generate -i shared/storage_service.yaml -g typescript-fetch -o ./db-service/src/generated/db_service --additional-properties=supportsES6=true,modelPropertyNaming=original