# Migrate
migrate:
	./scripts/migrate.sh

generate:
	source .venv/bin/activate && dotenv run ./scripts/generate_models.sh

watch:
	chmod +x run.sh && ./run.sh