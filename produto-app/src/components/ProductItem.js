import React from 'react';
import './ProductItem.css';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function ProductItem({ product, removeProduct, onEdit, position }) {
  return (
    <li
      className="product-item"
      style={{ animationDelay: `${position * 70}ms` }}
    >
      <div className="product-item-topline">
        <span className="product-chip">SKU {product.sku}</span>
        <strong className="product-price">
          {currencyFormatter.format(product.price)}
        </strong>
      </div>

      <div className="product-item-content">
        <h3>{product.name}</h3>
        <p className="product-caption">
          Letra ausente do nome: <strong>{product.missingLetter || '_'}</strong>
        </p>
        <div className="product-meta">
          <span>API sincronizada</span>
          <span>Persistido em SQLite</span>
        </div>
      </div>

      <div className="item-actions">
        <button onClick={() => onEdit(product)} className="edit-button">
          Editar
        </button>
        <button onClick={() => removeProduct(product.id)} className="remove-button">
          Remover
        </button>
      </div>
    </li>
  );
}

export default ProductItem;
