# Product Management - Frontend (React) and Backend (NestJS)

This project demonstrates a complete **product management** application, with a frontend built in **React** and a backend in **NestJS**. It allows you to **create, list, update, and delete products**, with a focus on **development best practices** and **user experience**.

---

## ✨ Features

- **Product Listing**: Displays all registered products, sorted alphabetically by name.
- **Add New Product**: Form to register new products, including name, price, and SKU.
- **Edit Product**: Modify the data of an existing product.
- **Delete Product**: Easily remove products from the list.
- **"Missing Letter" Calculation**: The backend calculates and stores a "missing letter" based on the SKU.
- **Currency Format (R$)**: The price is displayed in Brazilian Reais (R$), improving usability.
- **API Communication**: The frontend communicates with the backend to perform all **CRUD** operations.

---

## 🛠 Technologies Used

### Frontend (React)

- **React v18+**
- `useState`, `useEffect`
- **Fetch API**
- **CSS Modules** or traditional CSS
- `Intl.NumberFormat` (currency formatting)

### Backend (NestJS)

- **NestJS** with **TypeScript**
- **Express.js** (integrated with NestJS)
- **CORS** enabled
- Logic for calculating the **Missing Letter**

---

## 🚀 How to Run the Project

The project is divided into two parts: **frontend** and **backend**. Both must be run separately.

### 1. Backend (NestJS)

```bash
# Clone the repository or navigate to the backend/ folder
cd seu-projeto-nestjs

# Install dependencies
npm install
# or
yarn install

# Start the server
npm run start:dev
# or
yarn start:dev
```

> The backend will run at `http://localhost:3000`. Make sure CORS is enabled:
```ts
// main.ts
app.enableCors();
```

---

### 2. Frontend (React)

```bash
# Clone the repository or navigate to the frontend/ folder
cd seu-projeto-react

# Install dependencies
npm install
# or
yarn install

# Start the application
npm start
```

> React will open at `http://localhost:3000` or `http://localhost:3001`, depending on the available port.

---

## 🧩 Project Structure (Frontend)

```
produto-app/
├── public/
├── src/
│   ├── App.css              # Global styles
│   ├── App.js               # Main component
│   ├── index.css            # CSS reset and base
│   ├── index.js             # Entry point
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

## 🤝 Contributing

Contributions are welcome!
Feel free to open **issues** or submit a **pull request** with improvements, fixes, or suggestions.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for more details.
(Feel free to modify the license as needed.)

---

> Built with 💙 using React and NestJS.
