@echo off
echo Starting Micro-Frontend Applications...
echo.

echo Starting Chat App on port 3001...
start cmd /k "cd chat-app && npm run dev"

echo Starting Email App on port 3002...
start cmd /k "cd email-app && npm run dev"

timeout /t 5 /nobreak > nul

echo Starting Host App on port 3000...
start cmd /k "cd host-app && npm run dev"

echo.
echo All applications started!
echo.
echo Chat App: http://localhost:3001
echo Email App: http://localhost:3002
echo Host App: http://localhost:3000
echo.
echo Close the command windows to stop the applications