@echo off
echo Installing Django backend as Windows Service using NSSM...
echo.
echo Prerequisites: Download NSSM from https://nssm.cc/download
echo.
set SERVICE_NAME=PinobiteBackend
set NSSM_PATH=C:\path\to\nssm.exe
set PYTHON_PATH=C:\Users\A\Local Sites\pinobite\Pb\pb-backend\venv\Scripts\python.exe
set PROJECT_PATH=C:\Users\A\Local Sites\pinobite\Pb\pb-backend
set PORT=8003

:: Install the service
%NSSM_PATH% install %SERVICE_NAME% %PYTHON_PATH% "manage.py runserver 0.0.0.0:%PORT%"
%NSSM_PATH% set %SERVICE_NAME% AppDirectory "%PROJECT_PATH%"
%NSSM_PATH% set %SERVICE_NAME% DisplayName "Pinobite Backend"
%NSSM_PATH% set %SERVICE_NAME% Description "Pinobite Django Backend Server"

:: Start the service
%NSSM_PATH% start %SERVICE_NAME%

echo.
echo Service installed and started!
echo Use: %NSSM_PATH% stop %SERVICE_NAME% to stop
echo Use: %NSSM_PATH% remove %SERVICE_NAME% to uninstall
