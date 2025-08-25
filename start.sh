#!/bin/bash
cd client && npm run dev &
client_pid=$!
cd scheduler && npm run dev &
scheduler_pid=$!
cd scraping-service && npm run dev &
scraping_pid=$!
(cd generation-service && source venv/bin/activate && fastapi dev main.py --port 4001) &
generation_pid=$!
(cd embedding-service && source venv/bin/activate && fastapi dev app/main.py --port 4000) &
embedding_pid=$!

echo "Client PID: $client_pid"
echo "Scheduler Service PID: $scheduler_pid"
echo "Scraping Service PID: $scraping_pid"
echo "Generation Service PID: $generation_pid"
echo "Embedding Service PID: $embedding_pid"
echo "All services started. Press Ctrl+C to stop."
# Trap to kill all on exit
trap "echo 'Shutting down...'; kill $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid; exit" SIGINT SIGTERM

# Wait for all
wait $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid
