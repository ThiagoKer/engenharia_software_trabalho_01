# Script PowerShell para iniciar servidor
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidor Gamer Alpha" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Liberando porta 3000..." -ForegroundColor Yellow

# Encontrar e matar processos na porta 3000
$processes = netstat -ano | findstr :3000
if ($processes) {
    $processes | ForEach-Object {
        $fields = $_ -split '\s+'
        $pid = $fields[-1]
        if ($pid -match '^\d+$') {
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "  CheckMark Processo $pid finalizado" -ForegroundColor Green
            } catch {
                # Ignora erros
            }
        }
    }
} else {
    Write-Host "  CheckMark Porta 3000 ja esta livre" -ForegroundColor Green
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[2/2] Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
npm run dev
