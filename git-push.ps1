# Script de Inicializacion y Push a GitHub
# Ejecutar con: .\git-push.ps1

Write-Host "Iniciando sincronizacion con GitHub..." -ForegroundColor Cyan

# Verificar si Git esta instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git no esta instalado. Por favor instala Git desde https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "   O ejecuta: winget install --id Git.Git -e --source winget" -ForegroundColor Yellow
    exit 1
}

# Inicializar repositorio si no existe
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    git remote add origin https://github.com/annycastro9010-hue/concilia.git
}

# Agregar todos los archivos
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add .

# Commit con timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$message = "feat: Lanzamiento SaaS Inicial - $timestamp"
Write-Host "Creando commit: $message" -ForegroundColor Yellow
git commit -m $message

# Push a GitHub
Write-Host "Subiendo a GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "Sincronizacion completada!" -ForegroundColor Green
Write-Host "   Repositorio: https://github.com/annycastro9010-hue/concilia" -ForegroundColor Cyan
