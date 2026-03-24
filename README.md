# Gerenciador de Produtos

Aplicação full stack para cadastro de produtos, com backend em NestJS e frontend em React. O sistema permite criar, listar, editar e remover produtos, mantendo os dados em SQLite e expondo um campo derivado chamado `missingLetter`, calculado a partir do nome do produto.

## O que o projeto faz

- Cadastra produtos com `name`, `price` e `sku`
- Lista produtos em ordem alfabética
- Edita e remove produtos existentes
- Valida payloads no backend e no frontend
- Normaliza o `sku` para exatamente 3 letras maiúsculas
- Exibe o preço formatado em reais
- Retorna `missingLetter` em `camelCase` na API

## Stack

### Backend

- NestJS 11
- TypeORM
- SQLite
- `class-validator` + `class-transformer`

### Frontend

- React
- `fetch`
- Testing Library

## Estrutura

```text
.
├── src/                  # API NestJS
├── test/                 # Testes e2e do backend
├── produto-app/          # Aplicação React
└── db.sqlite             # Banco SQLite local
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base em [.env.example](./.env.example):

```env
PORT=3000
FRONTEND_URLS=http://localhost:3001,http://127.0.0.1:3001
DATABASE_PATH=db.sqlite
DB_SYNCHRONIZE=true
```

Crie também `produto-app/.env` com base em [produto-app/.env.example](./produto-app/.env.example):

```env
REACT_APP_API_URL=http://localhost:3000
```

## Como rodar

### 1. Backend

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`.

### 2. Frontend

```bash
cd produto-app
npm install
npm start
```

O React tentará subir em `http://localhost:3000`; se a porta estiver ocupada pelo backend, ele pode abrir em `http://localhost:3001`.

## Resposta da API

Exemplo de produto retornado por `GET /products`:

```json
{
  "id": "87a56cd1-4f8c-4cb7-b50a-5da83944cbf4",
  "name": "Camiseta Azul",
  "price": 49.9,
  "sku": "CAM",
  "missingLetter": "b"
}
```

## Regras de validação

- `name`: obrigatório
- `price`: número maior que zero, com até 2 casas decimais
- `sku`: obrigatório, exatamente 3 letras

## Testes

Backend:

```bash
npm test
npm run test:e2e
```

Frontend:

```bash
cd produto-app
npm test -- --watchAll=false
```
