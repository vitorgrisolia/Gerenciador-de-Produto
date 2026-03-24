import React, { useState, useEffect } from 'react';
import './ProductForm.css';

function ProductForm({ addProduct, updateProduct, productToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setName('');
    setPrice('');
    setSku('');
  }

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setSku(productToEdit.sku);
    } else {
      setName('');
      setPrice('');
      setSku('');
    }

    setFormError('');
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedSku = sku.trim().toUpperCase();
    const numericPrice = Number(price);

    if (!normalizedName || !sku.trim() || price === '') {
      setFormError('Por favor, preencha todos os campos.');
      return;
    }

    if (!/^[A-Z]{3}$/.test(normalizedSku)) {
      setFormError('O SKU deve conter exatamente 3 letras.');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setFormError('O preço deve ser maior que zero.');
      return;
    }

    const formData = {
      name: normalizedName,
      price: numericPrice,
      sku: normalizedSku,
    };

    setIsSubmitting(true);
    setFormError('');

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, formData);
      } else {
        await addProduct(formData);
        resetForm();
      }
    } catch (error) {
      setFormError(error.message || 'Não foi possível salvar o produto.');
    } finally {
      setIsSubmitting(false);
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
            min="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sku">SKU (3 letras):</label>
          <input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) =>
              setSku(e.target.value.replace(/[^a-z]/gi, '').toUpperCase())
            }
            placeholder='Ex: CAM'
            maxLength={3}
            pattern="[A-Za-z]{3}"
            required
          />
        </div>
        {formError && (
          <p className="error-message" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : productToEdit
              ? 'Salvar Alterações'
              : 'Adicionar Produto'}
        </button>
        {productToEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

export default ProductForm;
