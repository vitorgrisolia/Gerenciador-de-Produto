# Product Manager

Full-stack application for registering and maintaining products, with a NestJS backend and a React frontend. The system allows creating, listing, editing, and removing products, persisting data in SQLite and returning a derived field called `missingLetter`, computed from the product's name.

## Features

- Product registration with `name`, `price`, and `sku`
- Listing sorted alphabetically by name
- Editing and removing products
- Data validation on both frontend and backend
- Automatic normalization of `sku` to 3 uppercase letters
- Price formatting in Brazilian Reais (R$) on the frontend
- Conflict handling for duplicate `sku` with a `409 Conflict` response

## Architecture

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
- Simple per-component CSS

## Repository structure

```text
.
├── src/                  # NestJS API
├── test/                 # Backend e2e tests
├── produto-app/          # React application
├── db.sqlite             # Local SQLite database
└── README.md
```

## Environment variables

Create a `.env` file in the project root based on [.env.example](./.env.example):

```env
PORT=3000
FRONTEND_URLS=http://localhost:3001,http://127.0.0.1:3001
DATABASE_PATH=db.sqlite
DB_SYNCHRONIZE=true
```

Also create `produto-app/.env` based on [produto-app/.env.example](./produto-app/.env.example):

```env
REACT_APP_API_URL=http://localhost:3000
```

## How to run

### 1. Backend

From the project root:

```bash
npm install
npm run start:dev
```

API available at `http://localhost:3000`.

### 2. Frontend

In the `produto-app` directory:

```bash
cd produto-app
npm install
npm start
```

If port `3000` is taken by the backend, React will usually open at `http://localhost:3001`.

## Main endpoints

### `GET /products`

Lists all products sorted by name.

### `GET /products/:id`

Retrieves a product by `id`.

### `POST /products`

Creates a new product.

Example payload:

```json
{
  "name": "Camiseta Azul",
  "price": 49.9,
  "sku": "cam"
}
```

Example response:

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

Updates an existing product.

### `DELETE /products/:id`

Removes a product.

## Validation rules

- `name`: required
- `price`: number greater than zero, with up to 2 decimal places
- `sku`: required, exactly 3 letters

## Available scripts

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

## Already validated tests

The project has been validated with:

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`
- `cd produto-app && npm test -- --watchAll=false`
- `cd produto-app && npm run build`

## Notes

- The `missingLetter` field is computed from the product's name and is not persisted in the database.
- The backend uses a local SQLite database by default, ideal for development and testing.
- The `sku` is unique in the database.
