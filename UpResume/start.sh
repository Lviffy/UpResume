#!/bin/bash

# Store process IDs
pids=()

# Function to kill all processes
cleanup() {
    echo "Shutting down servers..."
    for pid in "${pids[@]}"; do
        kill $pid 2>/dev/null
    done
    exit 0
}

# Set up trap to catch SIGINT (Ctrl+C)
trap cleanup SIGINT SIGTERM

# Start npm run dev
cd "$(dirname "$0")"
npm run dev & 
pids+=($!)

# Start python backend
cd backend
python main.py &
pids+=($!)

# Wait for all processes to finish
wait
