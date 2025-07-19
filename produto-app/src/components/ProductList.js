import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';

function ProductList({ products, removeProduct, onEdit }) {
    if (products.length === 0) {
    return <p className="no-products-message">Nenhum produto cadastrado ainda. Adicione um!</p>;
    }

    return (
    <div className="product-list-container">
        <h2>Lista de Produtos</h2>
        <ul className="product-list">
        {products.map((product) => (
            <ProductItem
            key={product.id}
            product={product}
            removeProduct={removeProduct}
            onEdit={onEdit} 
            />
        ))}
        </ul>
    </div>
    );
}

export default ProductList;