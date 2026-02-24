# 🚫 Filtro de Palavrões - Gamer Alpha

## 📋 Descrição

Sistema automático de moderação que bloqueia palavrões e linguagem inapropriada em tópicos e comentários.

## ✅ Onde o Filtro é Aplicado

O filtro valida automaticamente:

- ✅ **Criar novo tópico** - Valida título e conteúdo
- ✅ **Editar tópico** - Valida título e conteúdo editados
- ✅ **Adicionar comentário** - Valida conteúdo do comentário

## 🛡️ Como Funciona

1. **Detecção Automática**: Quando o usuário tenta criar/editar conteúdo, o sistema verifica se há palavrões
2. **Bloqueio Imediato**: Se detectar linguagem inapropriada, bloqueia o envio
3. **Mensagem de Erro**: Retorna mensagem amigável pedindo para revisar o texto

## 💬 Exemplo de Uso

### ✅ Conteúdo Aceito
```json
{
  "titulo_topico": "Dicas para melhorar no CS:GO",
  "conteudo_topico": "Olá pessoal, queria compartilhar algumas dicas que me ajudaram..."
}
```
**Resposta**: Tópico criado com sucesso ✅

### ❌ Conteúdo Bloqueado
```json
{
  "titulo_topico": "Esse jogo é uma merda",
  "conteudo_topico": "Muito ruim..."
}
```
**Resposta**: 
```json
{
  "message": "O título contém linguagem inapropriada. Por favor, revise o texto.",
  "palavrasProibidas": 1
}
```

## 📝 Resposta do Sistema

Quando o filtro detecta palavrões:

```json
{
  "message": "O conteúdo contém linguagem inapropriada. Por favor, revise o texto.",
  "palavrasProibidas": 2
}
```

## 🔧 Configuração

O filtro está localizado em:
- **Arquivo**: `back-end/middleware/profanityFilter.js`
- **Middleware**: `validarConteudo`

### Adicionar/Remover Palavras

Edite o array `palavroes` em `profanityFilter.js`:

```javascript
const palavroes = [
  'palavra1', 'palavra2', 'palavra3',
  // Adicione mais palavras aqui
];
```

## 🎯 Testes

### Teste 1: Criar tópico com palavrão

```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -b "token=SEU_TOKEN" \
  -d '{
    "titulo_topico": "Teste com palavrão",
    "categoria_topico": "fps",
    "conteudo_topico": "Esse jogo é uma merda"
  }'
```

**Resultado esperado**: Erro 400 com mensagem de linguagem inapropriada

### Teste 2: Criar tópico sem palavrão

```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -b "token=SEU_TOKEN" \
  -d '{
    "titulo_topico": "Melhores jogos de FPS",
    "categoria_topico": "fps",
    "conteudo_topico": "Vamos discutir os melhores jogos?"
  }'
```

**Resultado esperado**: Tópico criado com sucesso (201)

## 🔒 Segurança

- ✅ Validação case-insensitive (maiúsculas/minúsculas)
- ✅ Detecta palavras completas (não partes de palavras)
- ✅ Protege contra variações com números (ex: "p0rra")
- ✅ Não revela quais palavras foram encontradas (privacidade)

## 📊 Status

✅ **Ativo e Funcionando**

O filtro está rodando automaticamente em todas as rotas de criação/edição de conteúdo.
