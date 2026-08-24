import React, { useDeferredValue, useEffect, useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

import './App.css';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
let activeApiBaseUrl = null;

function normalizeLocalBaseUrl(baseUrl) {
  return baseUrl.replace('://127.0.0.1', '://localhost').replace(/\/$/, '');
}

function getExplicitApiBaseUrl() {
  const baseUrl = process.env.REACT_APP_API_URL?.trim();

  return baseUrl ? normalizeLocalBaseUrl(baseUrl) : null;
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function getCandidateApiBaseUrls() {
  const explicitApiBaseUrl = getExplicitApiBaseUrl();

  if (explicitApiBaseUrl) {
    return [explicitApiBaseUrl];
  }

  const currentOrigin = normalizeLocalBaseUrl(window.location.origin);

  if (!isLocalHostname(window.location.hostname)) {
    return [currentOrigin];
  }

  return [...new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    currentOrigin,
  ])];
}

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

function shouldRetryWithAnotherBase(error) {
  return (
    !getExplicitApiBaseUrl() &&
    (error instanceof TypeError || error.status === 404)
  );
}

async function requestJson(path, options = {}) {
  const explicitApiBaseUrl = getExplicitApiBaseUrl();
  const candidateBaseUrls = explicitApiBaseUrl
    ? [explicitApiBaseUrl]
    : activeApiBaseUrl
      ? [activeApiBaseUrl]
      : getCandidateApiBaseUrls();
  let lastError = null;

  for (let index = 0; index < candidateBaseUrls.length; index += 1) {
    const baseUrl = candidateBaseUrls[index];
    const isLastCandidate = index === candidateBaseUrls.length - 1;

    try {
      const response = await fetch(`${baseUrl}${path}`, options);

      if (!response.ok) {
        const error = new Error(await getErrorMessage(response));
        error.status = response.status;

        if (!isLastCandidate && shouldRetryWithAnotherBase(error)) {
          lastError = error;
          continue;
        }

        throw error;
      }

      activeApiBaseUrl = baseUrl;
      return response.json();
    } catch (error) {
      lastError = error;

      if (!isLastCandidate && shouldRetryWithAnotherBase(error)) {
        continue;
      }

      break;
    }
  }

  throw lastError || new Error('Não foi possível conectar à API.');
}

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const data = await requestJson('/products');
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
      const addedProduct = await requestJson('/products', {
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
      await requestJson(`/products/${id}`, {
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
      const returnedProduct = await requestJson(`/products/${id}`, {
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
  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
  const visibleProducts = sortedProducts.filter((product) => {
    if (!normalizedSearch) {
      return true;
    }

    return `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(normalizedSearch);
  });
  const totalValue = products.reduce((accumulator, product) => {
    return accumulator + product.price;
  }, 0);
  const averagePrice = products.length > 0 ? totalValue / products.length : 0;
  const featuredProduct = products.reduce((currentFeatured, product) => {
    if (!currentFeatured || product.price > currentFeatured.price) {
      return product;
    }

    return currentFeatured;
  }, null);
  const productLabel = products.length === 1 ? 'produto ativo' : 'produtos ativos';
  const filteredLabel = searchTerm.trim()
    ? `${visibleProducts.length} resultado(s) para "${searchTerm.trim()}"`
    : `${products.length} ${productLabel}`;

  return (
    <div className="App">
      <div className="app-shell">
        <header className="hero-panel">
          <div className="hero-copy">
            <p className="app-kicker">Painel de produtos</p>
            <h1>Uma vitrine mais clara, viva e pronta para operar.</h1>
            <p className="app-subtitle">
              Gerencie itens com uma interface mais contemporânea, feedback
              imediato e foco no que importa: nome, SKU, preço e ação rápida.
            </p>

            <div className="hero-tags" aria-label="Recursos da interface">
              <span>Busca instantânea</span>
              <span>Validação em tempo real</span>
              <span>Feedback visual contínuo</span>
            </div>
          </div>

          <div className="hero-metrics">
            <article className="metric-card metric-card-primary">
              <span className="metric-label">Base atual</span>
              <strong>{products.length}</strong>
              <p>{productLabel}</p>
            </article>

            <article className="metric-card">
              <span className="metric-label">Preço médio</span>
              <strong>{currencyFormatter.format(averagePrice)}</strong>
              <p>Atualizado automaticamente a cada mudança.</p>
            </article>

            <article className="metric-card">
              <span className="metric-label">Produto destaque</span>
              <strong>{featuredProduct ? featuredProduct.sku : '---'}</strong>
              <p>
                {featuredProduct
                  ? `${featuredProduct.name} (${currencyFormatter.format(featuredProduct.price)})`
                  : 'Adicione o primeiro item para gerar destaque.'}
              </p>
            </article>
          </div>
        </header>

        <div className="workspace-grid">
          <aside className="workspace-sidebar">
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
          </aside>

          <main className="workspace-content">
            <section className="toolbar-panel">
              <div>
                <p className="toolbar-kicker">Catálogo</p>
                <h2>{filteredLabel}</h2>
                <p className="toolbar-description">
                  Filtre por nome ou SKU e acompanhe o catálogo em uma grade mais
                  visual.
                </p>
              </div>

              <label className="search-field" htmlFor="product-search">
                <span>Buscar produto</span>
                <input
                  id="product-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Ex: CAM, camiseta, bermuda"
                />
              </label>
            </section>

            {isLoading ? (
              <div className="loading-state">
                <p className="app-loading">Carregando produtos...</p>
                <div className="loading-grid" aria-hidden="true">
                  <span className="loading-card" />
                  <span className="loading-card" />
                  <span className="loading-card" />
                </div>
              </div>
            ) : (
              <ProductList
                products={visibleProducts}
                removeProduct={removeProduct}
                onEdit={startEditing}
                searchTerm={searchTerm}
                totalProducts={products.length}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
