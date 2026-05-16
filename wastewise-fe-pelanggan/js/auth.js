/**
 * auth.js — WasteWise Pelanggan
 * Scope: login, register, logout, toggle UI.
 * Loaded by: index.html (root) and Pages/signup.html
 *
 * FIX LOG:
 *  - saveSession() no longer redirects (was causing double-redirect loop)
 *  - handleRegister() redirect uses '../index.html' (correct for /Pages/ depth)
 *  - socialRegister() added so signup.html buttons don't crash
 */

const API_BASE_URL = "http://localhost:8000/api";

// ─────────────────────────────────────────────
// 1. SESSION HELPERS
// ─────────────────────────────────────────────

function saveSession(token, user) {
    localStorage.setItem('ww_token', token);
    if (user) {
        localStorage.setItem('ww_user', JSON.stringify(user));
    }
    // ✅ FIX 1: Redirect REMOVED from here.
    // saveSession() stores data only. One redirect fires per flow
    // from the caller (handleLogin / handleRegister), never two.
}

function getToken() {
    return localStorage.getItem('ww_token');
}

function clearSession() {
    localStorage.removeItem('ww_token');
    localStorage.removeItem('ww_user');
}

// ─────────────────────────────────────────────
// 2. CENTRAL FETCH WRAPPER
// ─────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
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
        const response = await fetch(API_BASE_URL + endpoint, {
            ...options,
            headers: headers
        });

        const data = await response.json().catch(function() { return {}; });
        return { ok: response.ok, status: response.status, data: data };

    } catch (err) {
        console.error('Network error:', err);
        return {
            ok: false,
            status: 0,
            data: { message: 'Tidak dapat terhubung ke server. Coba lagi.' }
        };
    }
}

// ─────────────────────────────────────────────
// 3. UI UTILITIES
// ─────────────────────────────────────────────

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function hideError(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add('hidden');
}

function setFieldError(wrapperId, hasError) {
    const el = document.getElementById(wrapperId);
    if (!el) return;
    if (hasError) {
        el.classList.add('input-error', 'border-red-400');
    } else {
        el.classList.remove('input-error', 'border-red-400');
    }
}

function setButtonLoading(buttonId, loading) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Memuat…';
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
    }
}

// ─────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────

function validatePhone(phone) {
    const digits = phone.trim().replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateName(name) {
    return name.trim().length >= 3;
}

function formatPhone(rawPhone) {
    const digits = rawPhone.trim().replace(/\D/g, '');
    return digits.startsWith('0') ? digits : '0' + digits;
}

// ─────────────────────────────────────────────
// 5. LOGIN HANDLER
// Loaded by: index.html (root level)
// Redirect target: 'Pages/dashboard.html' ← relative to root ✓
// ─────────────────────────────────────────────

async function handleLogin(event) {
    event.preventDefault();

    const rawPhone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    hideError('phoneError');
    hideError('passwordError');
    setFieldError('phoneWrapper', false);
    setFieldError('passwordWrapper', false);

    let valid = true;

    if (!validatePhone(rawPhone)) {
        showError('phoneError', 'Nomor harus angka & minimal 10 digit');
        setFieldError('phoneWrapper', true);
        valid = false;
    }

    if (!validatePassword(password)) {
        showError('passwordError', 'Password minimal 6 karakter');
        setFieldError('passwordWrapper', true);
        valid = false;
    }

    if (!valid) return;

    setButtonLoading('loginButton', true);

    const result = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ phone: formatPhone(rawPhone), password: password })
    });

    setButtonLoading('loginButton', false);

    const { ok, status, data } = result;

    if (ok && data.token) {
        saveSession(data.token, data.user || {});
        // ✅ FIX 1: Only ONE redirect here. saveSession() no longer redirects.
        window.location.href = 'Pages/dashboard.html';
        return;
    }

    // 422 — validation error (e.g. wrong credentials via ValidationException)
    if (status === 422 && data.errors) {
        if (data.errors.phone) {
            showError('phoneError', data.errors.phone[0]);
            setFieldError('phoneWrapper', true);
        }
        if (data.errors.password) {
            showError('passwordError', data.errors.password[0]);
            setFieldError('passwordWrapper', true);
        }
        return;
    }

    // 401 — explicit unauthorized
    if (status === 401) {
        showError('phoneError', data.message || 'Nomor atau kata sandi salah.');
        setFieldError('phoneWrapper', true);
        return;
    }

    showError('phoneError', data.message || 'Terjadi kesalahan, coba lagi.');
    setFieldError('phoneWrapper', true);
}

// ─────────────────────────────────────────────
// 6. REGISTER HANDLER
// Loaded by: Pages/signup.html (one level deep)
// Redirect target: '../index.html' ← correct for /Pages/ depth ✓
// ─────────────────────────────────────────────

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const rawPhone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    ['nameError', 'phoneError', 'emailError', 'passwordError', 'confirmPasswordError'].forEach(hideError);
    ['phoneWrapper', 'passwordWrapper', 'confirmPasswordWrapper'].forEach(function(id) { setFieldError(id, false); });
    if (nameInput) nameInput.classList.remove('border-red-400');
    if (emailInput) emailInput.classList.remove('border-red-400');

    let valid = true;

    if (!validateName(name)) {
        showError('nameError', 'Nama minimal 3 karakter');
        if (nameInput) nameInput.classList.add('border-red-400');
        valid = false;
    }

    if (!validatePhone(rawPhone)) {
        showError('phoneError', 'Nomor harus angka & minimal 10 digit');
        setFieldError('phoneWrapper', true);
        valid = false;
    }

    if (!validateEmail(email)) {
        showError('emailError', 'Email tidak valid');
        if (emailInput) emailInput.classList.add('border-red-400');
        valid = false;
    }

    if (!validatePassword(password)) {
        showError('passwordError', 'Password minimal 6 karakter');
        setFieldError('passwordWrapper', true);
        valid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Password tidak cocok');
        setFieldError('confirmPasswordWrapper', true);
        valid = false;
    }

    if (!valid) return;

    setButtonLoading('signupButton', true);

    const result = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            phone: formatPhone(rawPhone),
            email: email,
            password: password,
            password_confirmation: confirmPassword
        })
    });

    setButtonLoading('signupButton', false);

    const { ok, status, data } = result;

    if (ok && data.access_token) {
        saveSession(data.access_token, data.user || {});
        // ✅ FIX 2: '../index.html' is correct from Pages/signup.html
        // After register, send user to login to confirm credentials.
        alert('Pendaftaran berhasil! Silahkan masuk.');
        window.location.href = '../index.html';
        return;
    }

    if (status === 422 && data.errors) {
        if (data.errors.name) { showError('nameError', data.errors.name[0]); if (nameInput) nameInput.classList.add('border-red-400'); }
        if (data.errors.phone) {
            showError('phoneError', data.errors.phone[0]);
            setFieldError('phoneWrapper', true);
        }
        if (data.errors.email) { showError('emailError', data.errors.email[0]); if (emailInput) emailInput.classList.add('border-red-400'); }
        if (data.errors.password) {
            showError('passwordError', data.errors.password[0]);
            setFieldError('passwordWrapper', true);
        }
        return;
    }

    showError('nameError', data.message || 'Terjadi kesalahan, coba lagi.');
    if (nameInput) nameInput.classList.add('border-red-400');
}

// ─────────────────────────────────────────────
// 7. TOGGLE PASSWORD VISIBILITY
// Works for any password field inside a wrapper div
// ─────────────────────────────────────────────

function togglePassword(iconEl) {
    const wrapper = iconEl.closest('div');
    const input = wrapper ? wrapper.querySelector('input') : null;
    if (!input) return;

    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

    const icon = iconEl.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-eye', !isHidden);
        icon.classList.toggle('fa-eye-slash', isHidden);
    }
}

// ─────────────────────────────────────────────
// 8. SOCIAL LOGIN / REGISTER PLACEHOLDERS
// Both defined so no "undefined" crash on either page
// ─────────────────────────────────────────────

function socialLogin(provider) {
    alert('Login dengan ' + provider + ' belum tersedia.');
}

function socialRegister(provider) {
    // ✅ FIX 3: was missing → crash when Google/Facebook buttons clicked on signup.html
    alert('Daftar dengan ' + provider + ' belum tersedia.');
}

// ─────────────────────────────────────────────
// 9. ROUTE GUARD
// Redirect already-logged-in users away from auth pages
// ─────────────────────────────────────────────

function redirectIfLoggedIn() {
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('index.html') || path.endsWith('signup.html') || path === '/';

    if (getToken() && isAuthPage) {
        window.location.href = path.includes('/Pages/') ? 'dashboard.html' : 'Pages/dashboard.html';
    }
}

// ─────────────────────────────────────────────
// 10. BIND — everything starts here
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    redirectIfLoggedIn();

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleRegister);
});