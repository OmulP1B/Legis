# Portal Legislativ — Script pornire automata (Windows PowerShell)
# Ruleaza: Right-click -> "Run with PowerShell" sau in terminal: .\start.ps1

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Portal Legislativ — Pornire proiect" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[EROARE] Node.js nu este instalat!" -ForegroundColor Red
    Write-Host "Descarca de la: https://nodejs.org (versiunea LTS)" -ForegroundColor Yellow
    Read-Host "Apasa Enter pentru a iesi"
    exit 1
}

# Check pnpm
$pnpmOk = $false
try {
    $pnpmVersion = pnpm --version 2>&1
    Write-Host "[OK] pnpm: $pnpmVersion" -ForegroundColor Green
    $pnpmOk = $true
} catch {
    Write-Host "[INFO] pnpm nu e instalat. Instalez acum..." -ForegroundColor Yellow
    npm install -g pnpm
    $pnpmOk = $true
}

# Check Docker
$dockerOk = $false
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "[OK] Docker: $dockerVersion" -ForegroundColor Green
    $dockerOk = $true
} catch {
    Write-Host "[ATENTIE] Docker nu e instalat. Serviciile (DB, Redis, Elasticsearch) nu vor porni." -ForegroundColor Yellow
    Write-Host "Descarca Docker Desktop de la: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Selecteaza modul de pornire:" -ForegroundColor Cyan
Write-Host "  1. Docker Compose (recomandat) - porneste TOATE serviciile" -ForegroundColor White
Write-Host "  2. Frontend only (Next.js dev) - doar interfata, fara backend" -ForegroundColor White
Write-Host "  3. Instaleaza dependente si iesi" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Alegere (1/2/3)"

switch ($choice) {
    "1" {
        if (-not $dockerOk) {
            Write-Host "[EROARE] Docker nu este disponibil!" -ForegroundColor Red
            exit 1
        }
        # Copiem .env.example daca .env nu exista
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Host "[INFO] Fisier .env creat din .env.example. Editeaza valorile daca e necesar." -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Pornesc toate serviciile cu Docker Compose..." -ForegroundColor Cyan
        Write-Host "Prima pornire poate dura 5-10 minute (descarcari imagini Docker)" -ForegroundColor Yellow
        Write-Host ""
        docker compose up --build
    }
    "2" {
        Write-Host ""
        Write-Host "Instalez dependente frontend..." -ForegroundColor Cyan
        Set-Location apps\web
        if (-not (Test-Path "node_modules")) {
            pnpm install
        }
        if (-not (Test-Path ".env.local")) {
            @"
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
        }
        Write-Host ""
        Write-Host "Pornesc Next.js dev server pe http://localhost:3000 ..." -ForegroundColor Green
        Write-Host "(Nota: functiile care necesita backend/DB nu vor lucra fara docker)" -ForegroundColor Yellow
        Write-Host ""
        pnpm dev
    }
    "3" {
        Write-Host "Instalez toate dependentele..." -ForegroundColor Cyan
        pnpm install
        Write-Host ""
        Write-Host "[DONE] Dependente instalate!" -ForegroundColor Green
        Write-Host "Acum ruleaza: docker compose up --build" -ForegroundColor Cyan
    }
    default {
        Write-Host "Alegere invalida." -ForegroundColor Red
    }
}
