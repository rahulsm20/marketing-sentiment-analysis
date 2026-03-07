#!/bin/bash
cd client && npm run dev &
client_pid=$!
cd scheduler && npm run dev &
scheduler_pid=$!
cd scraping-service && npm run dev &
scraping_pid=$!
( cd generation-service || exit 1
  source .venv/bin/activate
  fastapi dev app/main.py --port 4001
) &
generation_pid=$!
(  cd embedding-service || exit 1
  source .venv/bin/activate
  fastapi dev app/main.py --port 4000
) &
embedding_pid=$!
cd db-service && npm run dev &
db_pid=$!
cd logging-service && npm run dev &
logging_pid=$!
cd storage-service && npm run dev &
storage_pid=$!
echo "Client PID: $client_pid"
echo "Scheduler Service PID: $scheduler_pid"
echo "Scraping Service PID: $scraping_pid"
echo "Generation Service PID: $generation_pid"
echo "Embedding Service PID: $embedding_pid"
echo "DB Service PID: $db_pid"
echo "Logging Service PID: $logging_pid"
echo "Storage Service PID: $storage_pid"
echo "All services started. Press Ctrl+C to stop."
# Trap to kill all on exit
trap "echo 'Shutting down...'; kill $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid $db_pid $logging_pid $storage_pid; exit" SIGINT SIGTERM

# Wait for all
wait $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid $db_pid $logging_pid $storage_pid
