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
```

> O backend rodará em `http://localhost:3000`. Certifique-se de que o CORS está habilitado:
```ts
// main.ts
app.enableCors();
```

---

### 2. Frontend (React)

```bash
# Clone o repositório ou navegue até a pasta frontend/
cd seu-projeto-react

# Instale as dependências
npm install
# ou
yarn install

# Inicie a aplicação
npm start
```

> O React abrirá em `http://localhost:3000` ou `http://localhost:3001`, dependendo da porta disponível.

---

## 🧩 Estrutura do Projeto (Frontend)

```
produto-app/
├── public/
├── src/
│   ├── App.css              # Estilos globais
│   ├── App.js               # Componente principal
│   ├── index.css            # Reset e base CSS
│   ├── index.js             # Ponto de entrada
│   ├── components/
│   │   ├── ProductForm.css
│   │   ├── ProductForm.js
│   │   ├── ProductList.css
│   │   ├── ProductList.js
│   │   ├── ProductItem.css
│   │   └── ProductItem.js
│   └── ...
└── package.json
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir **issues** ou enviar um **pull request** com melhorias, correções ou sugestões.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** – veja o arquivo [LICENSE](LICENSE) para mais detalhes.  
(Sinta-se livre para modificar a licença conforme necessário.)

---

> Desenvolvido com 💙 usando React e NestJS.
