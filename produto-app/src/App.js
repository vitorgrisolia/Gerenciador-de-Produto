import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null); 
  
  const API_URL = 'http://localhost:3000/products'; 

  // Carrega os produtos iniciais
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  // Função para adicionar um novo produto
  const addProduct = async (newProductData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  // Função para remover um produto
  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      console.log(`Produto com ID ${id} removido com sucesso!`);
      alert('Produto removido com sucesso! Atualize a Página para ver as mudanças.');
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  // Para atualizar um produto
  const updateProduct = async (updatedProductData) => {
    try {
      const response = await fetch(`${API_URL}/${updatedProductData.id}`, {
        method: 'PUT', // Ou 'PUT', dependendo do seu backend NestJS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const returnedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          String(product.id) === String(returnedProduct.id) ? returnedProduct : product
        )
      );
      setEditingProduct(null);
      console.log(`Produto com ID ${returnedProduct.id} atualizado com sucesso!`);
      alert('Produto atualizado com sucesso! Atualize a Página para ver as mudanças.');
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  //Função para iniciar a edição de um produto
  const startEditing = (product) => {
    setEditingProduct(product);
  };

  // Função para cancelar a edição
  const cancelEditing = () => {
    setEditingProduct(null);
  };

  // Ordena os produtos por nome
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="App">
      <h1>Gerenciamento de Produtos</h1>

      {}
      {editingProduct ? (
        <ProductForm 
          productToEdit={editingProduct}
          updateProduct={updateProduct}
          onCancel={cancelEditing} 
        />
      ) : (
        <ProductForm addProduct={addProduct} />
      )}
      
      <hr />
      <ProductList 
        products={sortedProducts} 
        removeProduct={removeProduct} 
        onEdit={startEditing}
      />
    </div>
  );
}

export default App;