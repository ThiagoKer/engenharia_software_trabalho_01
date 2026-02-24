@echo off
echo ============================================
echo  Gamer Alpha - Setup do Banco de Dados
echo ============================================
echo.

REM Solicitar informações do usuário
set /p PG_USER="Digite o usuario do PostgreSQL (padrao: postgres): "
if "%PG_USER%"=="" set PG_USER=postgres

set /p PG_PORT="Digite a porta do PostgreSQL (padrao: 5432): "
if "%PG_PORT%"=="" set PG_PORT=5432

set /p PG_PASS="Digite a senha do PostgreSQL: "

set DB_NAME=gamer_alpha

echo.
echo ============================================
echo Criando banco de dados...
echo ============================================

REM Criar banco de dados
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U %PG_USER% -p %PG_PORT% -c "CREATE DATABASE %DB_NAME%;"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo AVISO: Nao foi possivel criar o banco de dados.
    echo Ele pode ja existir ou o PostgreSQL nao esta no caminho padrao.
    echo.
    pause
)

echo.
echo ============================================
echo Executando script SQL...
echo ============================================

REM Executar schema SQL
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U %PG_USER% -p %PG_PORT% -d %DB_NAME% -f database\schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao executar o script SQL.
    echo Verifique se o PostgreSQL esta instalado corretamente.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Configurando arquivo .env...
echo ============================================

REM Criar arquivo .env se não existir
if not exist .env (
    echo PORT=3000 > .env
    echo DB_HOST=localhost >> .env
    echo DB_PORT=%PG_PORT% >> .env
    echo DB_USER=%PG_USER% >> .env
    echo DB_PASSWORD=%PG_PASS% >> .env
    echo DB_NAME=%DB_NAME% >> .env
    echo JWT_SECRET=seu_secret_jwt_mude_em_producao >> .env
    echo NODE_ENV=development >> .env
    echo.
    echo Arquivo .env criado com sucesso!
) else (
    echo Arquivo .env ja existe. Pulando...
)

echo.
echo ============================================
echo  Setup concluido com sucesso!
echo ============================================
echo.
echo Proximos passos:
echo 1. Execute: npm install
echo 2. Execute: npm run dev
echo 3. Acesse: http://localhost:3000/api/health
echo.
echo Credenciais do admin:
echo   Username: admin
echo   Password: admin123
echo.
pause
