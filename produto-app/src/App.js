import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

import './App.css';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3000')
  .replace(/\/$/, '');
const PRODUCTS_API_URL = `${API_BASE_URL}/products`;

async function getErrorMessage(response) {
  try {
    const errorBody = await response.json();

    if (Array.isArray(errorBody.message)) {
      return errorBody.message.join(' ');
    }

    if (typeof errorBody.message === 'string') {
      return errorBody.message;
    }
  } catch {
    return `Não foi possível concluir a requisição (${response.status}).`;
  }

  return `Não foi possível concluir a requisição (${response.status}).`;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const data = await requestJson(PRODUCTS_API_URL);
        setProducts(data);
        setFeedback(null);
      } catch (error) {
        setFeedback({
          type: 'error',
          message: error.message || 'Erro ao buscar produtos.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProductData) => {
    try {
      const addedProduct = await requestJson(PRODUCTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });

      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setFeedback({
        type: 'success',
        message: 'Produto cadastrado com sucesso.',
      });
      return addedProduct;
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao adicionar produto.',
      });
      throw error;
    }
  };

  const removeProduct = async (id) => {
    try {
      await requestJson(`${PRODUCTS_API_URL}/${id}`, {
        method: 'DELETE',
      });

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setEditingProduct((currentProduct) =>
        currentProduct?.id === id ? null : currentProduct,
      );
      setFeedback({
        type: 'success',
        message: 'Produto removido com sucesso.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao remover produto.',
      });
    }
  };

  const updateProduct = async (id, updatedProductData) => {
    try {
      const returnedProduct = await requestJson(`${PRODUCTS_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          String(product.id) === String(returnedProduct.id) ? returnedProduct : product
        )
      );
      setEditingProduct(null);
      setFeedback({
        type: 'success',
        message: 'Produto atualizado com sucesso.',
      });
      return returnedProduct;
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao atualizar produto.',
      });
      throw error;
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setFeedback(null);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const sortedProducts = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  );

  return (
    <div className="App app-shell">
      <header className="app-header">
        <p className="app-kicker">React + NestJS</p>
        <h1>Gerenciamento de Produtos</h1>
        <p className="app-subtitle">
          Cadastro simples com validação, persistência em SQLite e API REST.
        </p>
      </header>

      {feedback && (
        <p className={`app-feedback ${feedback.type}`} role="status">
          {feedback.message}
        </p>
      )}

      {editingProduct ? (
        <ProductForm
          productToEdit={editingProduct}
          updateProduct={updateProduct}
          onCancel={cancelEditing}
        />
      ) : (
        <ProductForm addProduct={addProduct} />
      )}

      <hr className="app-divider" />

      {isLoading ? (
        <p className="app-loading">Carregando produtos...</p>
      ) : (
        <ProductList
          products={sortedProducts}
          removeProduct={removeProduct}
          onEdit={startEditing}
        />
      )}
    </div>
  );
}

export default App;
