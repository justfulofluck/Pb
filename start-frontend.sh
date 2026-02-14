#!/bin/bash
cd pb-frontend
nohup npm run dev -- --port 3002 > /tmp/frontend.log 2>&1 &
echo "Frontend started on port 3002 (PID: $!)"
