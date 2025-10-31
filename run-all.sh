#!/bin/bash

echo "🚀 Starting Micro-Frontend Applications..."
echo ""

# Start Chat App
echo "📱 Starting Chat App on port 3001..."
cd chat-app
npm run dev &
CHAT_PID=$!

# Start Email App
echo "📧 Starting Email App on port 3002..."
cd ../email-app
npm run dev &
EMAIL_PID=$!

# Wait a bit for micro-frontends to start
sleep 5

# Start Host App
echo "🏠 Starting Host App on port 3000..."
cd ../host-app
npm run dev &
HOST_PID=$!

echo ""
echo "✅ All applications started!"
echo ""
echo "📱 Chat App: http://localhost:3001"
echo "📧 Email App: http://localhost:3002"
echo "🏠 Host App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all applications"

# Wait for Ctrl+C
trap "kill $CHAT_PID $EMAIL_PID $HOST_PID; exit" INT
wait