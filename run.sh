#!/bin/bash
cd client && npm run dev &
client_pid=$!
cd scraping-service && bun dev &
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
cd storage-service && npm run dev &
storage_pid=$!
cd scheduler && npm run dev &
scheduler_pid=$!
echo "Client PID: $client_pid"
echo "Scheduler Service PID: $scheduler_pid"
echo "Scraping Service PID: $scraping_pid"
echo "Generation Service PID: $generation_pid"
echo "Embedding Service PID: $embedding_pid"
echo "Storage Service PID: $storage_pid"
echo "All services started. Press Ctrl+C to stop."
# Trap to kill all on exit
# trap "echo 'Shutting down...'; kill $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid $db_pid $logging_pid $storage_pid; exit" SIGINT SIGTERM
shutdown() {
  echo ""
  echo "Gracefully shutting down services..."

  services=(
    "$client_pid:Client"
    "$scheduler_pid:Scheduler"
    "$scraping_pid:Scraping"
    "$generation_pid:Generation"
    "$embedding_pid:Embedding"
    "$storage_pid:Storage"
  )

  for svc in "${services[@]}"; do
    pid="${svc%%:*}"
    name="${svc##*:}"

    if kill -0 "$pid" 2>/dev/null; then
      echo "Stopping $name (PID $pid)..."
      kill -TERM "$pid"
      wait "$pid"
      echo "$name stopped."
    fi
  done

  echo "All services stopped."
  exit 0
}

trap shutdown SIGINT SIGTERM

# Wait for all
wait $client_pid $scheduler_pid $scraping_pid $generation_pid $embedding_pid $db_pid $storage_pid
