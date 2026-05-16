/**
 * app.js — WasteWise Pelanggan
 * Loaded by ALL protected pages: dashboard.html, profile.html, cart.html, history.html
 */

const API_BASE = 'http://localhost:8000/api'; // ← change once when deploying

// ─────────────────────────────────────────────
// 1. TOKEN & SESSION
// ─────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('ww_token');
}

function clearSession() {
    localStorage.removeItem('ww_token');
    localStorage.removeItem('ww_user');
}

// ─────────────────────────────────────────────
// 2. CENTRAL FETCH WRAPPER (JSON)
// Never redirects. Returns result to caller always.
// ─────────────────────────────────────────────

async function apiFetch(endpoint, options) {
    options = options || {};
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    try {
        const response = await fetch(API_BASE + endpoint, {
            ...options,
            headers: headers
        });

        const data = await response.json().catch(function() { return {}; });
        return { ok: response.ok, status: response.status, data: data };

    } catch (err) {
        console.error('Network error:', err);
        return { ok: false, status: 0, data: { message: 'Tidak dapat terhubung ke server.' } };
    }
}

// ─────────────────────────────────────────────
// 3. ROUTE GUARD
// ─────────────────────────────────────────────

function requireAuth() {
    if (!getToken()) {
        var path = window.location.pathname;
        window.location.href = path.includes('/Pages/') ? '../index.html' : 'index.html';
    }
}

// ─────────────────────────────────────────────
// 4. PROFILE API
// ─────────────────────────────────────────────

async function fetchProfile() {
    var result = await apiFetch('/me');
    return result.ok ? result.data : null;
}

async function updateProfile(payload) {
    return await apiFetch('/me', {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

/**
 * uploadPhoto(file)
 * Uploads a jpg File object to POST /api/me/photo via multipart/form-data.
 * Uses a raw fetch (NOT apiFetch) so we don't set Content-Type manually —
 * the browser must set it with the correct boundary for multipart.
 *
 * @param  {File}    file  - A jpg/jpeg File from <input type="file">
 * @returns {{ ok, status, data }}
 */
async function uploadPhoto(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', file);

    try {
        const response = await fetch(API_BASE + '/me/photo', {
            method: 'POST',
            headers: {
                // NOTE: Do NOT set Content-Type here — browser sets it with boundary
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        const data = await response.json().catch(function() { return {}; });
        return { ok: response.ok, status: response.status, data: data };

    } catch (err) {
        console.error('Photo upload network error:', err);
        return { ok: false, status: 0, data: { message: 'Gagal mengunggah foto. Periksa koneksi Anda.' } };
    }
}

// ─────────────────────────────────────────────
// 5. AUTH — logout
// ─────────────────────────────────────────────

async function logout() {
    if (!confirm('Apakah Anda yakin ingin keluar?')) return;

    await apiFetch('/logout', { method: 'POST' }).catch(function() {});
    clearSession();

    var path = window.location.pathname;
    window.location.href = path.includes('/Pages/') ? '../index.html' : 'index.html';
}

// ─────────────────────────────────────────────
// 6. RESTAURANT API
// ─────────────────────────────────────────────

async function fetchRestos() {
    var result = await apiFetch('/resto');
    return result.ok ? result.data : [];
}

async function fetchResto(kode) {
    var result = await apiFetch('/resto/' + kode);
    return result.ok ? result.data : null;
}

// ─────────────────────────────────────────────
// 7. MENU API
// ─────────────────────────────────────────────

async function fetchMenu(kodeMenu) {
    var result = await apiFetch('/menu/' + kodeMenu);
    return result.ok ? result.data : null;
}

// ─────────────────────────────────────────────
// 8. ORDER API
// ─────────────────────────────────────────────

async function fetchOrders() {
    var result = await apiFetch('/pesanan');
    return result.ok ? result.data : [];
}

async function fetchOrder(noPesanan) {
    var result = await apiFetch('/pesanan/' + noPesanan);
    return result.ok ? result.data : null;
}

async function placeOrder(payload) {
    return await apiFetch('/pesanan', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

// ─────────────────────────────────────────────
// 9. CART — localStorage only, no API
// ─────────────────────────────────────────────

function addToCart(name, price, stock, buttonEl) {
    stock = stock || 99;

    var cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    var existing = cart.find(function(item) { return item.name === name; });

    if (existing) {
        if (existing.qty < stock) {
            existing.qty += 1;
        } else {
            alert('Stok tidak mencukupi!');
            return;
        }
    } else {
        cart.push({ name: name, price: price, qty: 1, note: '', addedAt: new Date().toISOString() });
    }

    localStorage.setItem('wastewise_cart', JSON.stringify(cart));
    updateBadge();

    if (buttonEl) {
        var orig = buttonEl.innerHTML;
        buttonEl.innerHTML = '<i class="fas fa-check"></i>';
        buttonEl.classList.remove('bg-accent');
        buttonEl.classList.add('bg-green-600');
        buttonEl.disabled = true;

        setTimeout(function() {
            buttonEl.innerHTML = orig;
            buttonEl.classList.remove('bg-green-600');
            buttonEl.classList.add('bg-accent');
            buttonEl.disabled = false;
        }, 1000);
    }
}

function updateBadge() {
    var cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    var badges = document.querySelectorAll('#cart-badge');
    var totalItems = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);

    badges.forEach(function(badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function renderCartItems() {
    var container = document.getElementById('cart-items');
    if (!container) return;

    var cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    var emptyState = document.getElementById('empty-cart');

    if (cart.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    var html = '';
    cart.forEach(function(item, index) {
        html +=
            '<div class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">' +
            '<img src="../assets/images/nasigoreng.png" alt="' + item.name + '" class="w-16 h-16 object-cover rounded-lg"' +
            ' onerror="this.src=\'https://images.unsplash.com/photo-1603138842577-7b67493f342a?w=100&h=100&fit=crop\'">' +
            '<div class="flex-1">' +
            '<h3 class="font-semibold text-sm text-gray-800">' + item.name + '</h3>' +
            '<p class="text-xs text-gray-500">Rp' + item.price.toLocaleString('id-ID') + ' \u00d7 ' + item.qty + '</p>' +
            (item.note ? '<p class="text-xs text-gray-400 mt-1 italic">\u201c' + item.note + '\u201d</p>' : '') +
            '</div>' +
            '<div class="text-right">' +
            '<span class="font-bold text-sm text-primary block mb-2">Rp' + (item.price * item.qty).toLocaleString('id-ID') + '</span>' +
            '<button onclick="removeItem(' + index + ')" class="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">' +
            '<i class="fas fa-trash"></i> Hapus</button>' +
            '</div></div>';
    });

    container.innerHTML = html;
}

function updateSummary() {
    var subtotalEl = document.getElementById('subtotal');
    var totalEl = document.getElementById('total');
    if (!subtotalEl || !totalEl) return;

    var cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    if (cart.length === 0) {
        subtotalEl.textContent = 'Rp0';
        totalEl.textContent = 'Rp0';
        return;
    }

    var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
    var websiteFee = 500;

    subtotalEl.textContent = 'Rp' + subtotal.toLocaleString('id-ID');
    totalEl.textContent = 'Rp' + (subtotal + websiteFee).toLocaleString('id-ID');
}

function removeItem(index) {
    if (!confirm('Hapus item ini dari keranjang?')) return;

    var cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('wastewise_cart', JSON.stringify(cart));

    renderCartItems();
    updateSummary();
    updateBadge();
}

// ─────────────────────────────────────────────
// 10. TOAST
// ─────────────────────────────────────────────

function showToast(message, type) {
    type = type || 'success';

    var old = document.getElementById('ww-toast');
    if (old) old.remove();

    var colors = { success: '#16a34a', error: '#ef4444', info: '#374151' };

    var toast = document.createElement('div');
    toast.id = 'ww-toast';
    toast.style.cssText = [
        'position:fixed', 'bottom:90px', 'left:50%', 'transform:translateX(-50%)',
        'z-index:9999', 'background:' + (colors[type] || colors.info),
        'color:white', 'font-size:14px', 'font-weight:600',
        'padding:12px 20px', 'border-radius:12px',
        'box-shadow:0 4px 12px rgba(0,0,0,0.15)', 'transition:opacity 0.4s',
        'white-space:nowrap'
    ].join(';');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 400);
    }, 2500);
}

// ─────────────────────────────────────────────
// 11. DASHBOARD GREETING
// ─────────────────────────────────────────────

async function fetchUserProfile() {
    var result = await apiFetch('/me');
    var nameElement = document.getElementById('user-greeting-name');

    if (result.ok && result.data && result.data.name) {
        var firstName = result.data.name.split(' ')[0];
        if (nameElement) nameElement.textContent = firstName;
    } else {
        if (nameElement) nameElement.textContent = 'Pelanggan';
    }
}

// ─────────────────────────────────────────────
// 12. INIT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    updateBadge();
    renderCartItems();
    updateSummary();
});

window.addEventListener('focus', function() {
    updateBadge();
    renderCartItems();
    updateSummary();
});