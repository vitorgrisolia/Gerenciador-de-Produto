import React from 'react';
import './ProductItem.css';

function ProductItem({ product, removeProduct, onEdit }) {
    return (
    <li className="product-item">
    <div>
        <h3>{product.name}</h3>
        <p>Preço: R$ {product.price.toFixed(2)}</p>
        <p>SKU: {product.sku}</p>
        <p>Letra Ausente: **{product.missingLetter || 'N/A'}**</p>
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