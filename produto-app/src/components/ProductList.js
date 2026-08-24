import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';

function ProductList({
  products,
  removeProduct,
  onEdit,
  searchTerm,
  totalProducts,
}) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="no-products-message">
          {totalProducts > 0
            ? `Nenhum produto encontrado para "${searchTerm}".`
            : 'Nenhum produto cadastrado ainda. Adicione um!'}
        </p>
        <p className="empty-state-detail">
          {totalProducts > 0
            ? 'Tente outro termo de busca para explorar todo o catálogo.'
            : 'Assim que o primeiro item for salvo, ele aparecerá aqui com visual em card.'}
        </p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
        <div className="product-list-header">
          <div>
            <p className="product-list-kicker">Coleção visual</p>
            <h2>Lista de produtos</h2>
          </div>
          <span className="product-list-badge">{products.length} card(s)</span>
        </div>

        <ul className="product-list">
        {products.map((product, index) => (
            <ProductItem
            key={product.id}
            product={product}
            removeProduct={removeProduct}
            onEdit={onEdit}
            position={index}
            />
        ))}
        </ul>
    </div>
  );
}

export default ProductList;
