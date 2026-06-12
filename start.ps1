# ============================================
#  PlayTheWay - Skrypt startowy
#  Uruchamia n8n (Docker) + Frontend (Vite)
# ============================================

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $projectRoot "frontend-app"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PlayTheWay - Uruchamianie systemu   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- KROK 1: Sprawdz czy Docker jest uruchomiony ---
Write-Host "[1/4] Sprawdzam Docker Desktop..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "      BLAD: Docker Desktop nie jest uruchomiony!" -ForegroundColor Red
    Write-Host "      Uruchom Docker Desktop i sprobuj ponownie." -ForegroundColor Red
    Write-Host ""
    Read-Host "Nacisnij Enter aby zamknac"
    exit 1
}
Write-Host "      Docker Desktop dziala." -ForegroundColor Green

# --- KROK 2: Uruchom kontener n8n ---
Write-Host ""
Write-Host "[2/4] Uruchamianie n8n..." -ForegroundColor Yellow

# Sprawdz czy kontener 'n8n' juz dziala
$n8nStatus = docker inspect -f '{{.State.Status}}' n8n 2>&1
if ($n8nStatus -eq 'running') {
    Write-Host "      Kontener n8n juz dziala." -ForegroundColor Green
} else {
    docker start n8n 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      Kontener n8n uruchomiony." -ForegroundColor Green
    } else {
        Write-Host "      BLAD: Nie mozna uruchomic kontenera n8n!" -ForegroundColor Red
        Write-Host "      Sprawdz Docker Desktop recznie." -ForegroundColor DarkYellow
    }
}

# --- KROK 3: Poczekaj az n8n bedzie gotowe ---
Write-Host ""
Write-Host "[3/4] Czekam az n8n bedzie gotowe (10 sekund)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "      n8n powinno byc gotowe na http://localhost:5678" -ForegroundColor Green


# --- KROK 4: Uruchom frontend Vite w nowym oknie ---
Write-Host ""
Write-Host "[4/4] Uruchamianie aplikacji PlayTheWay..." -ForegroundColor Yellow

# Sprawdz czy node_modules istnieje
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "      Instalowanie zaleznosci (pierwsze uruchomienie)..." -ForegroundColor DarkYellow
    Set-Location $frontendDir
    npm install
}

# Uruchom Vite w nowym oknie PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; Write-Host 'Uruchamianie PlayTheWay Frontend...' -ForegroundColor Cyan; npm run dev"

# Poczekaj chwile az Vite sie uruchomi
Start-Sleep -Seconds 4

# Otworz przegladarke
Write-Host "      Otwieram przegladarke..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Wszystko uruchomione!               " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Aplikacja:  http://localhost:5173   " -ForegroundColor White
Write-Host "   n8n Panel:  http://localhost:5678   " -ForegroundColor White
Write-Host ""
Write-Host "   Aby zatrzymac n8n uruchom:          " -ForegroundColor DarkGray
Write-Host "   docker compose down                 " -ForegroundColor DarkGray
Write-Host ""
Read-Host "Nacisnij Enter aby zamknac to okno"
