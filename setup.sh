#!/bin/bash

echo "============================================"
echo "  Gamer Alpha - Setup do Banco de Dados"
echo "============================================"
echo ""

# Solicitar informações do usuário
read -p "Digite o usuario do PostgreSQL (padrao: postgres): " PG_USER
PG_USER=${PG_USER:-postgres}

read -p "Digite a porta do PostgreSQL (padrao: 5432): " PG_PORT
PG_PORT=${PG_PORT:-5432}

read -sp "Digite a senha do PostgreSQL: " PG_PASS
echo ""

DB_NAME="gamer_alpha"

echo ""
echo "============================================"
echo "Criando banco de dados..."
echo "============================================"

# Criar banco de dados
PGPASSWORD=$PG_PASS psql -U $PG_USER -p $PG_PORT -h localhost -c "CREATE DATABASE $DB_NAME;"

if [ $? -ne 0 ]; then
    echo ""
    echo "AVISO: Nao foi possivel criar o banco de dados."
    echo "Ele pode ja existir."
    echo ""
fi

echo ""
echo "============================================"
echo "Executando script SQL..."
echo "============================================"

# Executar schema SQL
PGPASSWORD=$PG_PASS psql -U $PG_USER -p $PG_PORT -h localhost -d $DB_NAME -f database/schema.sql

if [ $? -ne 0 ]; then
    echo ""
    echo "ERRO: Falha ao executar o script SQL."
    echo "Verifique se o PostgreSQL esta instalado corretamente."
    echo ""
    exit 1
fi

echo ""
echo "============================================"
echo "Configurando arquivo .env..."
echo "============================================"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=3000
DB_HOST=localhost
DB_PORT=$PG_PORT
DB_USER=$PG_USER
DB_PASSWORD=$PG_PASS
DB_NAME=$DB_NAME
JWT_SECRET=seu_secret_jwt_mude_em_producao
NODE_ENV=development
EOF
    echo "Arquivo .env criado com sucesso!"
else
    echo "Arquivo .env ja existe. Pulando..."
fi

echo ""
echo "============================================"
echo "  Setup concluido com sucesso!"
echo "============================================"
echo ""
echo "Proximos passos:"
echo "1. Execute: npm install"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000/api/health"
echo ""
echo "Credenciais do admin:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
