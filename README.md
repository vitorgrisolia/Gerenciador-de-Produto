# Gerenciamento de Produtos - Frontend (React) e Backend (NestJS)

Este projeto demonstra uma aplicação completa de **gerenciamento de produtos**, com um frontend desenvolvido em **React** e um backend em **NestJS**. Ele permite **criar, listar, atualizar e remover produtos**, com foco em **boas práticas de desenvolvimento** e **experiência do usuário**.

---

## ✨ Funcionalidades

- **Listagem de Produtos**: Exibe todos os produtos cadastrados, ordenados alfabeticamente pelo nome.
- **Adição de Novo Produto**: Formulário para cadastrar novos produtos, incluindo nome, preço e SKU.
- **Edição de Produto**: Modifique os dados de um produto existente.
- **Remoção de Produto**: Exclua produtos facilmente da lista.
- **Cálculo da "Letra Ausente"**: O backend calcula e armazena uma "letra ausente" com base no SKU.
- **Formato de Moeda (R$)**: O preço é exibido em reais (R$), melhorando a usabilidade.
- **Comunicação via API**: O frontend se comunica com o backend para realizar todas as operações **CRUD**.

---

## 🛠 Tecnologias Utilizadas

### Frontend (React)

- **React v18+**
- `useState`, `useEffect`
- **Fetch API**
- **CSS Modules** ou CSS tradicional
- `Intl.NumberFormat` (formatação de moeda)

### Backend (NestJS)

- **NestJS** com **TypeScript**
- **Express.js** (integrado ao NestJS)
- **CORS** habilitado
- Lógica para cálculo da **Letra Ausente**

---

## 🚀 Como Rodar o Projeto

O projeto é dividido em duas partes: **frontend** e **backend**. Ambas devem ser executadas separadamente.

### 1. Backend (NestJS)

```bash
# Clone o repositório ou navegue até a pasta backend/
cd seu-projeto-nestjs

# Instale as dependências
npm install
# ou
yarn install

# Inicie o servidor
npm run start:dev
# ou
yarn start:dev
