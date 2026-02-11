const form = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const submitBtn = document.getElementById('submit-btn');
const message = document.getElementById('message');
const editingIdInput = document.getElementById('editingId');

const titleInput = document.getElementById('title');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const sizesInput = document.getElementById('sizes');
const imageInput = document.getElementById('image');
const inStockInput = document.getElementById('inStock');

const adminOnlyBox = document.getElementById('adminOnly');

let isAdmin = false;

function show(text, ok = false) {
  if (!message) return;
  message.innerHTML = `<div class="alert ${ok ? 'alert-success' : 'alert-danger'}">${text}</div>`;
}

async function loadMe() {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      window.location.href = '/login';
      return false;
    }
    const me = await res.json();
    isAdmin = me.role === 'admin';

    if (!isAdmin) {
      if (adminOnlyBox) adminOnlyBox.style.display = 'none';
      if (form) form.style.display = 'none'; 
    }
    return true;
  } catch (e) {
    show('Network error. Try again.', false);
    return false;
  }
}

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    renderProducts(Array.isArray(products) ? products : []);
  } catch (e) {
    show('Failed to load products', false);
  }
}

function renderProducts(products) {
  productsList.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'col-md-4';

    div.innerHTML = `
      <div class="card p-3">
        <h5>${escapeHtml(p.title || '')}</h5>
        <p>${Number(p.price ?? 0)} tg</p>
        <small>${escapeHtml(p.category || '')}</small>

        ${
          isAdmin
            ? `
              <div class="mt-2 d-flex gap-2">
                <button class="btn btn-sm btn-outline-dark edit-btn">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
              </div>
            `
            : `
              <div class="mt-2">
                <small class="text-muted">Read-only mode (no admin rights)</small>
              </div>
            `
        }
      </div>
    `;

    if (isAdmin) {
      div.querySelector('.edit-btn')
        .addEventListener('click', () => startEdit(p));

      div.querySelector('.delete-btn')
        .addEventListener('click', () => deleteProduct(p._id));
    }

    productsList.appendChild(div);
  });
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!isAdmin) {
    show('You do not have admin rights.', false);
    return;
  }

  const product = {
    title: titleInput.value,
    price: Number(priceInput.value),
    category: categoryInput.value,
    sizes: (sizesInput.value || '').split(',').map(s => s.trim()).filter(Boolean),
    image: imageInput.value,
    inStock: inStockInput.checked
  };

  const id = editingIdInput.value;

  try {
    if (id) {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (!res.ok) {
        const data = await safeJson(res);
        return show(data?.message || 'Update failed', false);
      }

      show('Updated', true);
    } else {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (!res.ok) {
        const data = await safeJson(res);
        return show(data?.message || 'Add failed', false);
      }

      show('Added', true);
    }

    resetForm();
    loadProducts();
  } catch (e2) {
    show('Network error. Try again.', false);
  }
});

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

function startEdit(p) {
  if (!isAdmin) return;

  editingIdInput.value = p._id;

  titleInput.value = p.title || '';
  priceInput.value = p.price ?? '';
  categoryInput.value = p.category || '';
  sizesInput.value = Array.isArray(p.sizes) ? p.sizes.join(',') : '';
  imageInput.value = p.image || '';
  inStockInput.checked = !!p.inStock;

  submitBtn.textContent = 'Save changes';
}

async function deleteProduct(id) {
  if (!isAdmin) return;

  if (!confirm('Delete this product?')) return;

  try {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await safeJson(res);
      return show(data?.message || 'Delete failed', false);
    }
    loadProducts();
  } catch (e) {
    show('Network error. Try again.', false);
  }
}

function resetForm() {
  form?.reset();
  editingIdInput.value = '';
  submitBtn.textContent = 'Add product';
}

(async function init() {
  const ok = await loadMe();
  if (ok) loadProducts();
})();