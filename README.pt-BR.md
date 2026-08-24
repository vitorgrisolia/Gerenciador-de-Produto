# Gerenciador de Produtos

Aplicação full stack para cadastro e manutenção de produtos, com backend em NestJS e frontend em React. O sistema permite criar, listar, editar e remover produtos, persistindo os dados em SQLite e retornando um campo derivado chamado `missingLetter`, calculado a partir do nome do produto.

## Funcionalidades

- Cadastro de produtos com `name`, `price` e `sku`
- Listagem ordenada alfabeticamente pelo nome
- Edição e remoção de produtos
- Validação de dados no frontend e no backend
- Normalização automática do `sku` para 3 letras maiúsculas
- Formatação de preço em reais no frontend
- Tratamento de conflito para `sku` duplicado com resposta `409 Conflict`

## Arquitetura

### Backend

- NestJS 11
- TypeORM
- SQLite
- `class-validator`
- `class-transformer`

### Frontend

- React
- `fetch`
- Testing Library
- CSS simples por componente

## Estrutura do repositório

```text
.
├── src/                  # API NestJS
├── test/                 # Testes e2e do backend
├── produto-app/          # Aplicação React
├── db.sqlite             # Banco local SQLite
└── README.md
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

## Como executar

### 1. Backend

Na raiz do projeto:

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`.

### 2. Frontend

No diretório `produto-app`:

```bash
cd produto-app
npm install
npm start
```

Se a porta `3000` estiver ocupada pelo backend, o React normalmente abrirá em `http://localhost:3001`.

## Endpoints principais

### `GET /products`

Lista todos os produtos ordenados por nome.

### `GET /products/:id`

Busca um produto por `id`.

### `POST /products`

Cria um novo produto.

Exemplo de payload:

```json
{
  "name": "Camiseta Azul",
  "price": 49.9,
  "sku": "cam"
}
```

Exemplo de resposta:

```json
{
  "id": "87a56cd1-4f8c-4cb7-b50a-5da83944cbf4",
  "name": "Camiseta Azul",
  "price": 49.9,
  "sku": "CAM",
  "missingLetter": "b"
}
```

### `PUT /products/:id`

Atualiza um produto existente.

### `DELETE /products/:id`

Remove um produto.

## Regras de validação

- `name`: obrigatório
- `price`: número maior que zero e com até 2 casas decimais
- `sku`: obrigatório, com exatamente 3 letras

## Scripts disponíveis

### Backend

```bash
npm run start:dev
npm run build
npm run lint
npm test
npm run test:e2e
```

### Frontend

```bash
cd produto-app
npm start
npm run build
npm test -- --watchAll=false
```

## Testes já validados

O projeto foi validado com:

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`
- `cd produto-app && npm test -- --watchAll=false`
- `cd produto-app && npm run build`

## Observações

- O campo `missingLetter` é calculado a partir do nome do produto e não é persistido no banco.
- O backend usa SQLite local por padrão, ideal para desenvolvimento e testes.
- O `sku` é único no banco de dados.
