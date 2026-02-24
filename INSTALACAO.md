# Guia de Instalação e Configuração - Gamer Alpha Backend

## 📦 Passo 1: Instalar PostgreSQL

### Windows:
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação, defina uma senha para o usuário `postgres` (guarde essa senha!)
4. Mantenha a porta padrão: `5432`

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

## 🔧 Passo 2: Configurar o Banco de Dados

### 1. Acessar o PostgreSQL:
```bash
# Windows (PowerShell)
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Linux/macOS
psql -U postgres
```

### 2. Criar o banco de dados:
```sql
CREATE DATABASE gamer_alpha;
\q
```

### 3. Executar o script de criação de tabelas:

**Windows (PowerShell):**
```powershell
cd c:\Users\thiag\Desktop\engenharia_software_trabalho_01\back-end
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d gamer_alpha -f database\schema.sql
```

**Linux/macOS:**
```bash
cd /caminho/para/back-end
psql -U postgres -d gamer_alpha -f database/schema.sql
```

Ou copie e cole o conteúdo do arquivo `database/schema.sql` no terminal do psql.

## 📝 Passo 3: Configurar as Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e configure suas credenciais:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI  # A senha que você definiu na instalação
DB_NAME=gamer_alpha
JWT_SECRET=mude_isso_para_algo_seguro_em_producao
NODE_ENV=development
```

## 📦 Passo 4: Instalar Dependências do Node.js

Certifique-se de ter o Node.js instalado (versão 14 ou superior).

```bash
cd c:\Users\thiag\Desktop\engenharia_software_trabalho_01\back-end
npm install
```

## 🚀 Passo 5: Executar o Servidor

### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

## ✅ Passo 6: Testar a API

Abra seu navegador ou use o Postman/Insomnia e acesse:
```
http://localhost:3000/api/health
```

Você deve ver:
```json
{
  "status": "OK",
  "message": "Gamer Alpha API está funcionando!"
}
```

## 🔐 Credenciais Padrão

Um usuário admin é criado automaticamente:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@gameralpha.com

**IMPORTANTE:** Altere essa senha em produção!

## 🔧 Configurar o Front-end

Para que o front-end se conecte ao back-end:

1. Abra o arquivo `app.js` do front-end
2. Certifique-se que as URLs da API apontam para `http://localhost:3000`
3. Se necessário, ajuste a configuração de CORS no `server.js`

Por padrão, o CORS está configurado para aceitar requisições de:
- `http://localhost:5500` (Live Server)
- Você pode alterar isso no arquivo `server.js`

## 🐛 Troubleshooting

### Erro: "password authentication failed"
- Verifique se a senha no `.env` está correta
- Confira o usuário do PostgreSQL

### Erro: "database does not exist"
- Execute novamente o comando CREATE DATABASE
- Verifique se está conectando ao banco correto

### Erro: "ECONNREFUSED"
- Certifique-se que o PostgreSQL está rodando
- Windows: Verifique nos Serviços do Windows
- Linux/macOS: `sudo service postgresql status`

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Delete a pasta `node_modules` e `package-lock.json`, depois `npm install`

## 📱 Próximos Passos

1. ✅ Abra o front-end no navegador
2. ✅ Faça login com as credenciais admin
3. ✅ Crie algumas categorias
4. ✅ Crie tópicos de teste
5. ✅ Teste todas as funcionalidades

## 🎉 Pronto!

Seu backend está configurado e funcionando! 🚀
