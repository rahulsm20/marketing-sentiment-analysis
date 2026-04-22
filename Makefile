migrate:
	./scripts/migrate.sh

generate:
	source .venv/bin/activate && dotenv run ./scripts/generate_models.sh

run:
	chmod +x run.sh && ./run.sh

kill:
	pkill 4001 