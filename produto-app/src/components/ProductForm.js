import React, { useState, useEffect } from 'react';
import './ProductForm.css';

function ProductForm({ addProduct, updateProduct, productToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');

  // Preenche o formulário
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setSku(productToEdit.sku);
    } else {
      // Limpa o formulário
      setName('');
      setPrice('');
      setSku('');
    }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !sku) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const formData = {
      name,
      price: parseFloat(price),
      sku: sku.toUpperCase(),
    };

    if (productToEdit) {
      
      updateProduct({ ...formData, id: productToEdit.id });
    } else {
      
      addProduct(formData);
    }

    
  };

  return (
    <div className="product-form-container">
      <h2>{productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Ex: Camiseta Azul'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Ex: 19.99'
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sku">SKU (primeiras 3 letras):</label>
          <input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder='Ex: CAM'
            maxLength="3"
            required
          />
        </div>
        <button type="submit">
          {productToEdit ? 'Salvar Alterações' : 'Adicionar Produto'}
        </button>
        {productToEdit && ( 
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

export default ProductForm;