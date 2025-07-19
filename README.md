Gerenciamento de Produtos - Frontend (React) e Backend (NestJS)
Este projeto demonstra uma aplicação completa de gerenciamento de produtos, com um frontend desenvolvido em React e um backend em NestJS. Ele permite criar, listar, atualizar e remover produtos, com um foco em boas práticas de desenvolvimento e experiência do usuário.

Funcionalidades
Listagem de Produtos: Exibe todos os produtos cadastrados, ordenados alfabeticamente pelo nome.

Adição de Novo Produto: Formulário para cadastrar novos produtos, incluindo nome, preço e SKU.

Edição de Produto: Formulário para modificar os dados de um produto existente.

Remoção de Produto: Botão para excluir um produto da lista.

Cálculo da "Letra Ausente": O backend calcula e armazena uma "letra ausente" baseada no SKU do produto.

Formato de Moeda em R$: O campo de preço no frontend é formatado em Reais (R$) para melhor usabilidade.

Comunicação API: O frontend se comunica com o backend NestJS para todas as operações CRUD (Create, Read, Update, Delete).

Tecnologias Utilizadas
Frontend (React)
React v18+: Biblioteca JavaScript para construção de interfaces de usuário.

useState e useEffect Hooks: Para gerenciamento de estado e efeitos colaterais.

Fetch API: Para comunicação assíncrona com o backend.

CSS Modules (ou arquivos CSS padrão): Estilização de componentes.

Intl.NumberFormat: Para formatação de valores monetários.

Backend (NestJS)
NestJS: Framework progressivo Node.js para construção de aplicações eficientes e escaláveis do lado do servidor.

TypeScript: Linguagem de programação que adiciona tipagem estática ao JavaScript.

Express.js (integrado ao NestJS): Servidor web.

CORS: Configurado para permitir requisições do frontend.

Lógica de Negócio: Implementação do cálculo da "letra ausente".

Como Rodar o Projeto
Este projeto é composto por duas partes independentes (frontend e backend) que devem ser iniciadas separadamente.

1. Backend (NestJS)
Clone o repositório do seu projeto NestJS (assumindo que ele está em um repositório separado ou em uma pasta backend/ dentro de um monorepo).

Navegue até a pasta raiz do seu projeto NestJS no terminal:

Bash

cd seu-projeto-nestjs
Instale as dependências:

Bash

npm install
# ou
yarn install
Inicie o servidor NestJS:

Bash

npm run start:dev
# ou
yarn start:dev
O backend estará rodando por padrão em http://localhost:3000. Certifique-se de que o CORS está habilitado no seu arquivo main.ts do NestJS (adicione app.enableCors();).

2. Frontend (React)
Clone o repositório do seu projeto React (ou navegue até a pasta frontend/ se estiver em um monorepo).

Navegue até a pasta raiz do seu projeto React no terminal:

Bash

cd seu-projeto-react
Instale as dependências:

Bash

npm install
# ou
yarn install
Inicie a aplicação React:

Bash

npm start
A aplicação React será aberta no seu navegador, geralmente em http://localhost:3000 ou http://localhost:3001 (para evitar conflito com o backend).

Estrutura do Projeto Frontend (React)
produto-app/
├── public/
├── src/
│   ├── App.css           # Estilos globais e layout do App
│   ├── App.js            # Componente principal, gerencia estado global e comunicação com API
│   ├── index.css         # Estilos base e reset
│   ├── index.js          # Ponto de entrada da aplicação
│   ├── components/
│   │   ├── ProductForm.css   # Estilos para o formulário de adição/edição
│   │   ├── ProductForm.js    # Componente de formulário para adicionar e editar produtos
│   │   ├── ProductList.css   # Estilos para a lista de produtos
│   │   ├── ProductList.js    # Componente que renderiza a lista de ProductItem
│   │   ├── ProductItem.css   # Estilos para um único item de produto
│   │   └── ProductItem.js    # Componente que renderiza os detalhes de um produto
│   └── ...
└── package.json
Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Licença
MIT License (Ou a licença que você preferir para o seu projeto)