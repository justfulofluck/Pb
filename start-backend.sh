#!/bin/bash
cd pb-backend
nohup python3 manage.py runserver 0.0.0.0:8003 > /tmp/backend.log 2>&1 &
echo "Backend started on port 8003 (PID: $!)"
