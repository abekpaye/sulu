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

  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const currentPageEl = document.getElementById('current-page');

  if (!container) return;

  let currentPage = 1;
  let totalPages = 1;
  let currentQueryParams = new URLSearchParams();

  async function loadProducts() {
    currentQueryParams.set('page', currentPage);
    currentQueryParams.set('inStock', 'true');

    const query = '?' + currentQueryParams.toString();

    const res = await fetch('/api/products' + query);
    const result = await res.json();

    totalPages = result.pages || 1;
    currentPage = result.page;

    renderProducts(result.data);
    updatePagination();
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

            <button class="add-to-cart btn btn-dark w-100 mt-2"
                    data-id="${product._id}">
              Add to cart
            </button>
          </div>
        </div>
      `;
    });
  }

  function updatePagination() {
    currentPageEl.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadProducts();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadProducts();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      currentQueryParams = new URLSearchParams(new FormData(form));
      currentPage = 1;
      loadProducts();
    });

    form.addEventListener('reset', () => {
      setTimeout(() => {
        currentQueryParams = new URLSearchParams();
        currentPage = 1;
        loadProducts();
      }, 0);
    });
  }

  loadProducts();
});