import React from 'react';
import './ProductItem.css';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function ProductItem({ product, removeProduct, onEdit }) {
  return (
    <li className="product-item">
      <div className="product-item-content">
        <h3>{product.name}</h3>
        <p>Preço: {currencyFormatter.format(product.price)}</p>
        <p>SKU: {product.sku}</p>
        <p>
          Letra ausente do nome: <strong>{product.missingLetter || '_'}</strong>
        </p>
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
