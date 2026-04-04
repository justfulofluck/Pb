@echo off
echo Starting Pb Project...
echo.

:: Start backend in a new window
echo Starting Django backend...
start "Django Backend" cmd /k "cd pb-backend && venv\Scripts\activate && python manage.py runserver 8000"

:: Start frontend in a new window
echo Starting Vite frontend...
start "Vite Frontend" cmd /k "cd pb-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173 (or check vite output for exact port)
echo.
echo Press any close the windows to stop the servers.
pause