# Script de teste para verificar o sistema de denúncias

# 1. Login como usuário
Write-Host "1. Fazendo login como novoUsuario..." -ForegroundColor Cyan
$loginBody = @{
    username = "novoUsuario"
    password = "senha123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody `
  -UseBasicParsing `
  -SessionVariable session

$loginData = $loginResponse.Content | ConvertFrom-Json
Write-Host "✓ Login bem-sucedido" -ForegroundColor Green
Write-Host "  Token: $($loginData.token.Substring(0, 20))..." -ForegroundColor Gray

# 2. Denunciar um tópico
Write-Host "`n2. Denunciando o tópico ID 5..." -ForegroundColor Cyan
$reportBody = @{
    reason = "Conteúdo inapropriado - teste do sistema"
} | ConvertTo-Json

$reportResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/topics/5/report" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $($loginData.token)"
  } `
  -Body $reportBody `
  -UseBasicParsing

$reportData = $reportResponse.Content | ConvertFrom-Json
Write-Host "✓ Denúncia criada com ID: $($reportData.report_id)" -ForegroundColor Green
Write-Host "  Status: $($reportData.status)" -ForegroundColor Gray

# 3. Login como admin
Write-Host "`n3. Fazendo login como admin..." -ForegroundColor Cyan
$adminLoginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$adminLoginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $adminLoginBody `
  -UseBasicParsing

$adminData = $adminLoginResponse.Content | ConvertFrom-Json
Write-Host "✓ Login do admin bem-sucedido" -ForegroundColor Green

# 4. Listar denúncias pendentes
Write-Host "`n4. Listando denúncias pendentes..." -ForegroundColor Cyan
$reportsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/reports" `
  -Headers @{"Authorization"="Bearer $($adminData.token)"} `
  -UseBasicParsing

$reportsData = $reportsResponse.Content | ConvertFrom-Json
Write-Host "✓ $($reportsData.reports.Count) denúncias encontradas:" -ForegroundColor Green

foreach ($report in $reportsData.reports) {
    Write-Host "  - ID: $($report.id) | Tópico: $($report.topic_id) | Status: $($report.status) | Denunciante: $($report.username)" -ForegroundColor Gray
}

# 5. Resolver a denúncia (ignorar)
Write-Host "`n5. Ignorando a denúncia ID $($reportData.report_id)..." -ForegroundColor Cyan
$resolveBody = @{
    action = "ignore"
} | ConvertTo-Json

$resolveResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/reports/$($reportData.report_id)/resolve" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $($adminData.token)"
  } `
  -Body $resolveBody `
  -UseBasicParsing

$resolveData = $resolveResponse.Content | ConvertFrom-Json
Write-Host "✓ Denúncia resolvida" -ForegroundColor Green
Write-Host "  Novo status: $($resolveData.status)" -ForegroundColor Gray

Write-Host "`n✓ Teste do sistema de denúncias concluído com sucesso!" -ForegroundColor Green
