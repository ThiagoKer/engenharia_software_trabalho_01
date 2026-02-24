@echo off
echo ========================================
echo   Iniciando Servidor Gamer Alpha
echo ========================================
echo.

echo [1/2] Liberando porta 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)
echo Porta 3000 liberada!

echo.
echo [2/2] Iniciando servidor...
cd /d "%~dp0"
call npm run dev
