# Teste Manual da API - Gamer Alpha

Este documento contém comandos cURL para testar manualmente todos os endpoints da API.

## Pré-requisitos

Certifique-se de que:
1. O servidor está rodando em http://localhost:3000
2. O banco de dados está configurado
3. Você tem o cURL instalado (ou use Postman/Insomnia)

## 1. Health Check

```bash
curl http://localhost:3000/api/health
```

## 2. Autenticação

### Registrar novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "senha123"
  }' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }' \
  -c cookies.txt
```

### Ver dados do usuário autenticado
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## 3. Categorias

### Listar categorias
```bash
curl http://localhost:3000/api/categories
```

### Ver categoria específica
```bash
curl http://localhost:3000/api/categories/1
```

### Criar categoria (ADMIN)
```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Aventura"
  }'
```

### Editar categoria (ADMIN)
```bash
curl -X PUT http://localhost:3000/api/admin/categories/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "FPS Modificado"
  }'
```

### Deletar categoria (ADMIN)
```bash
curl -X DELETE http://localhost:3000/api/admin/categories/7 \
  -b cookies.txt
```

## 4. Tópicos

### Listar tópicos
```bash
# Todos os tópicos
curl http://localhost:3000/api/topics

# Com limite
curl http://localhost:3000/api/topics?limit=10

# Por categoria
curl http://localhost:3000/api/topics?category=fps
```

### Ver tópico específico
```bash
curl http://localhost:3000/api/topics/1
```

### Criar tópico
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "titulo_topico": "Melhor build para iniciantes",
    "categoria_topico": "rpg",
    "conteudo_topico": "Vou compartilhar a melhor build para começar no jogo..."
  }'
```

### Editar tópico
```bash
curl -X PUT http://localhost:3000/api/topics/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "titulo_post": "Título atualizado",
    "categoria_post": "fps",
    "conteudo_post": "Conteúdo atualizado..."
  }'
```

### Deletar tópico
```bash
curl -X DELETE http://localhost:3000/api/topics/1 \
  -b cookies.txt
```

### Curtir/Descurtir tópico
```bash
curl -X POST http://localhost:3000/api/topics/1/like \
  -b cookies.txt
```

## 5. Comentários

### Listar comentários de um tópico
```bash
curl http://localhost:3000/api/topics/1/comments
```

### Adicionar comentário
```bash
curl -X POST http://localhost:3000/api/topics/1/comments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "conteudo_comentario": "Excelente post! Muito útil."
  }'
```

## 6. Usuários

### Ver tópicos do usuário autenticado
```bash
curl http://localhost:3000/api/users/me/topics \
  -b cookies.txt
```

### Atualizar perfil (sem upload)
```bash
curl -X POST http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "novousername",
    "email": "novoemail@example.com"
  }'
```

### Atualizar perfil (com upload de avatar)
```bash
curl -X POST http://localhost:3000/api/users/me \
  -b cookies.txt \
  -F "avatar=@/caminho/para/imagem.jpg" \
  -F "username=novousername"
```

### Deletar conta
```bash
curl -X DELETE http://localhost:3000/api/users/me \
  -b cookies.txt
```

## 7. Admin

### Ver denúncias
```bash
curl http://localhost:3000/api/admin/reports \
  -b cookies.txt
```

### Resolver denúncia
```bash
# Excluir tópico denunciado
curl -X POST http://localhost:3000/api/admin/reports/1/resolve \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "excluir"
  }'

# Ignorar denúncia
curl -X POST http://localhost:3000/api/admin/reports/1/resolve \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "ignorar"
  }'
```

### Ver estatísticas
```bash
curl http://localhost:3000/api/admin/stats \
  -b cookies.txt
```

## Observações

1. **Cookies**: O arquivo `cookies.txt` armazena o token de autenticação
2. **Headers**: Sempre use `Content-Type: application/json` para requisições JSON
3. **Autenticação**: Use `-b cookies.txt` para enviar cookies de autenticação
4. **Admin**: Rotas admin requerem que o usuário seja admin

## PowerShell (Windows)

Se estiver usando PowerShell no Windows, substitua `\` por `` ` `` (backtick) para quebra de linha:

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username": "admin", "password": "admin123"}' `
  -c cookies.txt
```

Ou use Invoke-RestMethod:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `
  -Method Post `
  -Body (@{username="admin"; password="admin123"} | ConvertTo-Json) `
  -ContentType "application/json" `
  -SessionVariable session
```
