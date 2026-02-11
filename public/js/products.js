function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('filter-form');
  const container = document.getElementById('products-row');

  if (!container) return;

  async function loadProducts(query = '') {
    const res = await fetch('/api/products' + query);
    const products = await res.json();
    renderProducts(products);
  }

  function renderProducts(products) {
    container.innerHTML = '';

    if (!products || products.length === 0) {
      container.innerHTML = '<p class="text-center">No products found</p>';
      return;
    }

    products.forEach(product => {
      const sizes = Array.isArray(product.sizes)
      ? product.sizes.map(s => `<option>${escapeHtml(s)}</option>`).join('')
      : '';

      container.innerHTML += `
        <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <img src="${escapeHtml(product.image)}" 
            class="product-image" 
            alt="${escapeHtml(product.title)}">

            <div class="product-title">
            ${escapeHtml(product.title)}
            </div>

            <div class="product-price">
            ${Number(product.price ?? 0)} tg
            </div>

            ${sizes ? `
              <div class="size-container">
                <select class="size-select">${sizes}</select>
              </div>` : ''
            }

            <button class="add-to-cart btn btn-dark w-100 mt-2" data-id="${product._id}">
              Add to cart
            </button>
          </div>
        </div>
      `;
    });
  }

  loadProducts('?inStock=true');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const params = new URLSearchParams(new FormData(form));
      params.append('inStock', 'true');
      const query = '?' + params.toString();
      console.log('FETCH:', query);
      loadProducts(query);
    });

    form.addEventListener('reset', () => {
      setTimeout(() => loadProducts('?inStock=true'), 0);
    });
  }
});
