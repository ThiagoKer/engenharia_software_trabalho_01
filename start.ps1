# ============================================
# Script de Inicialização Rápida - PowerShell
# Gamer Alpha Backend
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Gamer Alpha - Inicialização Rápida" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado! Por favor, instale o Node.js." -ForegroundColor Red
    exit 1
}

# Verificar se o PostgreSQL está instalado
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL"
if (Test-Path $pgPath) {
    Write-Host "✓ PostgreSQL encontrado" -ForegroundColor Green
} else {
    Write-Host "! PostgreSQL não encontrado no caminho padrão" -ForegroundColor Yellow
    Write-Host "  Certifique-se de que está instalado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Instalando dependências..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Instalar dependências
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host ""

# Verificar se .env existe
if (-not (Test-Path .env)) {
    Write-Host "! Arquivo .env não encontrado" -ForegroundColor Yellow
    Write-Host "  Criando .env a partir do .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ Arquivo .env criado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANTE: Edite o arquivo .env com suas configurações do PostgreSQL!" -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "Deseja editar o .env agora? (s/n)"
    if ($response -eq 's' -or $response -eq 'S') {
        notepad .env
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configuração do Banco de Dados" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$setupDB = Read-Host "Deseja configurar o banco de dados agora? (s/n)"

if ($setupDB -eq 's' -or $setupDB -eq 'S') {
    Write-Host ""
    Write-Host "Executando setup do banco de dados..." -ForegroundColor Yellow
    .\setup.bat
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Setup Completo!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Green
Write-Host "  1. Certifique-se de que o arquivo .env está configurado" -ForegroundColor White
Write-Host "  2. Se ainda não fez, execute o setup do banco (.\setup.bat)" -ForegroundColor White
Write-Host "  3. Inicie o servidor: npm run dev" -ForegroundColor White
Write-Host "  4. Acesse: http://localhost:3000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Credenciais padrão do admin:" -ForegroundColor Yellow
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""

$startServer = Read-Host "Deseja iniciar o servidor agora? (s/n)"
if ($startServer -eq 's' -or $startServer -eq 'S') {
    Write-Host ""
    Write-Host "Iniciando servidor..." -ForegroundColor Green
    npm run dev
}
