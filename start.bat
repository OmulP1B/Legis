@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   Portal Legislativ — Pornire proiect
echo ==========================================
echo.
echo Verificare Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [EROARE] Node.js nu este instalat!
    echo Descarca de la: https://nodejs.org
    pause
    exit /b 1
)

echo Verificare pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo Instalare pnpm...
    npm install -g pnpm
)

echo.
echo Selecteaza modul:
echo   1. Docker Compose - toate serviciile (recomandat)
echo   2. Doar frontend Next.js
echo.
set /p choice="Alegere (1 sau 2): "

if "%choice%"=="1" (
    if not exist ".env" copy ".env.example" ".env"
    echo.
    echo Pornesc cu Docker Compose...
    docker compose up --build
) else (
    echo.
    echo Instalez dependente frontend...
    cd apps\web
    if not exist "node_modules" pnpm install
    if not exist ".env.local" (
        echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
        echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env.local
    )
    echo.
    echo Pornesc pe http://localhost:3000 ...
    pnpm dev
)
