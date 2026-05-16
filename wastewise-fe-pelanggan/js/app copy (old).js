// ==========================================
// APP.JS - Shared Functions for WasteWise
// Functions: addToCart, updateBadge, renderCartItems, updateSummary, removeItem
// ==========================================

// ========== FUNGSI KERANJANG (GLOBAL) ==========

console.error("🚨 THE NEW APP.JS IS OFFICIALLY RUNNING 🚨");

// Tambah ke keranjang - dipanggil dari tombol "+" di produk
function addToCart(name, price, stock = 99) {
    let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        if (existingItem.qty < stock) {
            existingItem.qty += 1;
        } else {
            alert('Stok tidak mencukupi!');
            return;
        }
    } else {
        cart.push({
            name: name,
            price: price,
            qty: 1,
            note: '',
            addedAt: new Date().toISOString()
        });
    }

    localStorage.setItem('wastewise_cart', JSON.stringify(cart));
    updateBadge();

    // Visual feedback
    element.addEventListener('click', function(event) {
        const btn = event.target.closest('button');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.remove('bg-accent');
            btn.classList.add('bg-green-600');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('bg-green-600');
                btn.classList.add('bg-accent');
            }, 1000);
        }
    });
}

// Update badge keranjang di navigasi
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    const badges = document.querySelectorAll('#cart-badge');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

// Render item keranjang untuk halaman cart.html
function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    const emptyState = document.getElementById('empty-cart');

    if (cart.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    let html = '';
    cart.forEach((item, index) => {
                html += `
            <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
                <img src="../assets/images/nasigoreng.png" alt="${item.name}" 
                     class="w-16 h-16 object-cover rounded-lg"
                     onerror="this.src='https://images.unsplash.com/photo-1603138842577-7b67493f342a?w=100&h=100&fit=crop'">
                <div class="flex-1">
                    <h3 class="font-semibold text-sm text-gray-800">${item.name}</h3>
                    <p class="text-xs text-gray-500">Rp${item.price.toLocaleString('id-ID')} × ${item.qty}</p>
                    ${item.note ? `<p class="text-xs text-gray-400 mt-1 italic">"${item.note}"</p>` : ''}
                </div>
                <div class="text-right">
                    <span class="font-bold text-sm text-primary block mb-2">Rp${(item.price * item.qty).toLocaleString('id-ID')}</span>
                    <button onclick="removeItem(${index})" class="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update ringkasan harga untuk halaman cart.html
function updateSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (!subtotalEl || !totalEl) return;

    const cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    
    if (cart.length === 0) {
        subtotalEl.textContent = 'Rp0';
        totalEl.textContent = 'Rp0';
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const websiteFee = 500;
    const total = subtotal + websiteFee;
    
    subtotalEl.textContent = `Rp${subtotal.toLocaleString('id-ID')}`;
    totalEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
}

// Hapus item dari keranjang
function removeItem(index) {
    if (confirm('Hapus item ini dari keranjang?')) {
        let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('wastewise_cart', JSON.stringify(cart));
        
        // Re-render UI
        renderCartItems();
        updateSummary();
        updateBadge();
    }
}

// ========== INISIALISASI ==========

document.addEventListener('DOMContentLoaded', function() {
    // Update badge navigasi (berjalan di semua halaman)
    updateBadge();
    
    // Update konten keranjang (hanya berjalan di cart.html)
    renderCartItems();
    updateSummary();
});

// Update UI saat window mendapat fokus (kembali dari halaman lain)
window.addEventListener('focus', function() {
    updateBadge();
    renderCartItems();
    updateSummary();
});

async function fetchUserProfile() {
    const token = localStorage.getItem('ww_token')?.trim();
    
    if (!token) {
        console.warn("No token found. Redirecting to login.");
        console.error("AUTH FAIL: Redirecting to login.");
        localStorage.removeItem('ww_token');
        window.location.href = '../index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            
            // Log it just to be absolutely sure!
            console.log("USER DATA FETCHED:", userData);
            
            const nameElement = document.getElementById('user-greeting-name');
            if (nameElement && userData.name) {
                // Splits "Felicia Wijaya" and just takes "Felicia"
                const firstName = userData.name.split(' ')[0];
                nameElement.textContent = firstName;
            }
        } else {
            console.error("AUTH FAIL: Middleware rejected the token. HTTP Status:", response.status);
            // localStorage.removeItem('ww_token');
            // window.location.href = '../index.html'; 
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.getElementById('user-greeting-name').textContent = 'Pelanggan'; 
    }
}