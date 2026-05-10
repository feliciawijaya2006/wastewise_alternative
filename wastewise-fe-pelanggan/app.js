// File: app.js - FINAL VERSION

// ========== VALIDASI & LOGIN ==========

document.addEventListener('DOMContentLoaded', function() {
    
    // Setup Login Form (jika ada)
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phoneInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.getElementById('loginButton');
    
    if (loginForm && phoneInput && passwordInput) {
        // Validasi real-time untuk phone (hanya angka)
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length > 0 && this.value.length < 10) {
                showError('phoneError', true);
                this.classList.add('input-error');
            } else {
                showError('phoneError', false);
                this.classList.remove('input-error');
            }
        });
        
        // Validasi password
        passwordInput.addEventListener('input', function(e) {
            if (this.value.length > 0 && this.value.length < 6) {
                showError('passwordError', true);
                this.classList.add('input-error');
            } else {
                showError('passwordError', false);
                this.classList.remove('input-error');
            }
        });
        
        // Handle Form Submit
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = phoneInput.value;
            const password = passwordInput.value;
            
            let isValid = true;
            
            if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) {
                showError('phoneError', true);
                phoneInput.classList.add('input-error');
                isValid = false;
            }
            
            if (!password || password.length < 6) {
                showError('passwordError', true);
                passwordInput.classList.add('input-error');
                isValid = false;
            }
            
            if (isValid) {
                loginButton.disabled = true;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                
                setTimeout(() => {
                    localStorage.setItem('wastewise_user', JSON.stringify({
                        phone: phone,
                        isLoggedIn: true,
                        loginTime: new Date().toISOString()
                    }));
                    
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }
    
    // Update badge saat halaman dimuat
    updateBadge();
});

function showError(elementId, show) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        if (show) {
            errorElement.classList.remove('hidden');
        } else {
            errorElement.classList.add('hidden');
        }
    }
}

function socialLogin(provider) {
    alert(`Login dengan ${provider} akan segera tersedia!`);
}

// ========== FUNGSI KERANJANG ==========

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ 
            name: name, 
            price: price, 
            qty: 1,
            addedAt: new Date().toISOString()
        });
    }

    localStorage.setItem('wastewise_cart', JSON.stringify(cart));
    updateBadge();
    
    // Visual feedback
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.classList.remove('bg-green-600');
    btn.classList.add('bg-green-800');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-800');
        btn.classList.add('bg-green-600');
    }, 1000);
}

function updateBadge() {
    let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    let badge = document.getElementById('cart-badge');
    
    if (badge) {
        if (cart.length > 0) {
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            badge.innerText = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function renderCartPage() {
    let cartContainer = document.getElementById('cart-items');
    let totalDisplay = document.getElementById('total-price');
    
    if (!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center mt-10">
                <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i class="fas fa-shopping-cart text-4xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 text-sm mb-2">Keranjangmu masih kosong</p>
                <p class="text-gray-400 text-xs">Yuk, tambah makanan favoritmu!</p>
                <a href="dashboard.html" class="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                    Mulai Belanja
                </a>
            </div>
        `;
        if (totalDisplay) totalDisplay.innerText = "Rp0";
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl mb-3 shadow-sm">
                <div class="flex items-center flex-1">
                    <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3 flex-shrink-0 flex items-center justify-center">
                        <i class="fas fa-utensils text-green-600"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-sm text-gray-800 truncate">${item.name}</h4>
                        <p class="text-xs text-gray-500">Rp${item.price.toLocaleString('id-ID')} × ${item.qty}</p>
                    </div>
                </div>
                <div class="text-right ml-2">
                    <div class="font-bold text-green-700 text-sm">Rp${(item.price * item.qty).toLocaleString('id-ID')}</div>
                    <button onclick="removeFromCart(${index})" class="text-xs text-red-500 mt-1 hover:underline flex items-center justify-end">
                        <i class="fas fa-trash mr-1"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    if (totalDisplay) {
        totalDisplay.innerText = `Rp${total.toLocaleString('id-ID')}`;
    }
}

function removeFromCart(index) {
    if (confirm('Hapus item dari keranjang?')) {
        let cart = JSON.parse(localStorage.getItem('wastewise_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('wastewise_cart', JSON.stringify(cart));
        renderCartPage();
        updateBadge();
    }
}

// Jalankan saat halaman dimuat
window.onload = function() {
    updateBadge();
    renderCartPage();
};