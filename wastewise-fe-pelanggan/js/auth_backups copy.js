/**
 * auth.js — WasteWise Pelanggan
 * Handles ALL authentication API calls: login, register, logout.
 * Bulletproof execution order: No IIFEs.
 */

const API_BASE_URL = "http://localhost:8000/api";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SESSION HELPERS (Must be at the top)
// ─────────────────────────────────────────────────────────────────────────────

function saveSession(token, user) {
    // 1. Use the exact parameter name passed into the function ('token')
    // 2. Use the exact key your app expects ('ww_token')
    localStorage.setItem('ww_token', token);

    // Optional but good practice: save the user data if you need it for the dashboard
    if (user) {
        localStorage.setItem('ww_user', JSON.stringify(user));
    }

    window.location.href = 'Pages/dashboard.html';
}

function getToken() {
    return localStorage.getItem("ww_token");
}

function clearSession() {
    localStorage.removeItem("ww_token");
    localStorage.removeItem("ww_user");
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CENTRAL FETCH WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: headers
        });

        const data = await response.json().catch(function() { return {}; });
        return { ok: response.ok, status: response.status, data: data };
    } catch (err) {
        console.error("Network error:", err);
        return {
            ok: false,
            status: 0,
            data: { message: "Tidak dapat terhubung ke server. Coba lagi." }
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. UI UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("hidden");
}

function hideError(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
}

function setFieldError(wrapperId, hasError) {
    const el = document.getElementById(wrapperId);
    if (!el) return;
    if (hasError) {
        el.classList.add("input-error", "border-red-400");
    } else {
        el.classList.remove("input-error", "border-red-400");
    }
}

function setButtonLoading(buttonId, loading) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.disabled = loading;

    if (loading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = "Memuat…";
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validatePhone(phone) {
    // Remove everything that is not a number
    const digits = phone.trim().replace(/\D/g, "");
    // Check if the remaining digits are between 10 and 15 characters
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
    const digits = rawPhone.trim().replace(/\D/g, "");
    if (digits.startsWith("0")) {
        return digits;
    } else {
        return "0" + digits;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOGIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

async function handleLogin(event) {
    event.preventDefault();

    const rawPhone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    hideError("phoneError");
    hideError("passwordError");
    setFieldError("phoneWrapper", false);
    setFieldError("passwordWrapper", false);

    let valid = true;

    if (!validatePhone(rawPhone)) {
        showError("phoneError", "Nomor harus angka & minimal 10 digit");
        setFieldError("phoneWrapper", true);
        valid = false;
    }

    if (!validatePassword(password)) {
        showError("passwordError", "Password minimal 6 karakter");
        setFieldError("passwordWrapper", true);
        valid = false;
    }

    if (!valid) return;

    setButtonLoading("loginButton", true);

    const result = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ phone: formatPhone(rawPhone), password: password })
    });

    const ok = result.ok;
    const status = result.status;
    const data = result.data;

    setButtonLoading("loginButton", false);

    if (ok && data.token) {
        saveSession(data.token, data.user || {});
        window.location.href = "Pages/dashboard.html";
        return;
    }

    if (status === 422 && data.errors) {
        if (data.errors.phone) {
            showError("phoneError", data.errors.phone[0]);
            setFieldError("phoneWrapper", true);
        }
        if (data.errors.password) {
            showError("passwordError", data.errors.password[0]);
            setFieldError("passwordWrapper", true);
        }
        return;
    }

    if (status === 401) {
        showError("phoneError", data.message || "Nomor atau kata sandi salah.");
        setFieldError("phoneWrapper", true);
        return;
    }

    showError("phoneError", data.message || "Terjadi kesalahan, coba lagi.");
    setFieldError("phoneWrapper", true);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REGISTER HANDLER 
// ─────────────────────────────────────────────────────────────────────────────

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const rawPhone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const errorFields = ["nameError", "phoneError", "emailError", "passwordError", "confirmPasswordError"];
    errorFields.forEach(hideError);

    const wrapperFields = ["phoneWrapper", "passwordWrapper", "confirmPasswordWrapper"];
    wrapperFields.forEach(function(id) { setFieldError(id, false); });

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    if (nameInput) nameInput.classList.remove("border-red-400");
    if (emailInput) emailInput.classList.remove("border-red-400");

    let valid = true;

    if (!validateName(name)) {
        showError("nameError", "Nama minimal 3 karakter");
        if (nameInput) nameInput.classList.add("border-red-400");
        valid = false;
    }

    if (!validatePhone(rawPhone)) {
        showError("phoneError", "Nomor harus angka & minimal 10 digit");
        setFieldError("phoneWrapper", true);
        valid = false;
    }

    if (!validateEmail(email)) {
        showError("emailError", "Email tidak valid");
        if (emailInput) emailInput.classList.add("border-red-400");
        valid = false;
    }

    if (!validatePassword(password)) {
        showError("passwordError", "Password minimal 6 karakter");
        setFieldError("passwordWrapper", true);
        valid = false;
    }

    if (password !== confirmPassword) {
        showError("confirmPasswordError", "Password tidak cocok");
        setFieldError("confirmPasswordWrapper", true);
        valid = false;
    }

    // --- DIAGNOSTIC PROBE START ---
    console.log("=== REGISTRATION ATTEMPT ===");
    console.log("Name valid?", validateName(name), `(Length: ${name.length})`);
    console.log("Phone valid?", validatePhone(rawPhone), `(Cleaned: ${rawPhone.replace(/\D/g, "")})`);
    console.log("Email valid?", validateEmail(email));
    console.log("Password valid?", validatePassword(password));
    console.log("Passwords match?", password === confirmPassword);

    if (!valid) {
        console.error("❌ ABORTED: Frontend validation failed. The network request was blocked.");
        return;
    }
    console.log("✅ VALIDATION PASSED. Sending data to Laravel...");
    // --- DIAGNOSTIC PROBE END ---

    setButtonLoading("signupButton", true);

    const result = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            phone: formatPhone(rawPhone),
            email: email,
            password: password,
            password_confirmation: confirmPassword
        })
    });

    const ok = result.ok;
    const status = result.status;
    const data = result.data;

    setButtonLoading("signupButton", false);

    if (ok && data.access_token) {
        saveSession(data.access_token, data.user || {});
        alert("Pendaftaran berhasil!");
        window.location.href = "../index.html";
        return;
    }

    if (status === 422 && data.errors) {
        if (data.errors.name) { showError("nameError", data.errors.name[0]); if (nameInput) nameInput.classList.add("border-red-400"); }
        if (data.errors.phone) {
            showError("phoneError", data.errors.phone[0]);
            setFieldError("phoneWrapper", true);
        }
        if (data.errors.email) { showError("emailError", data.errors.email[0]); if (emailInput) emailInput.classList.add("border-red-400"); }
        if (data.errors.password) {
            showError("passwordError", data.errors.password[0]);
            setFieldError("passwordWrapper", true);
        }
        return;
    }

    if (status === 409 || status === 500) {
        showError("phoneError", data.message || "Terjadi kesalahan pada server database.");
        setFieldError("phoneWrapper", true);
        return;
    }

    showError("nameError", data.message || "Terjadi kesalahan, coba lagi.");
    if (nameInput) nameInput.classList.add("border-red-400");
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LOGOUT & TOGGLE UI
// ─────────────────────────────────────────────────────────────────────────────

async function handleLogout() {
    await apiFetch("/logout", { method: "POST" });
    clearSession();
    window.location.href = "../index.html";
}

function togglePassword(iconEl) {
    const wrapper = iconEl.closest("div");
    const input = wrapper ? wrapper.querySelector("input") : null;
    if (!input) return;

    const isHidden = input.type === "password";

    if (isHidden) {
        input.type = "text";
    } else {
        input.type = "password";
    }

    const icon = iconEl.querySelector("i");
    if (icon) {
        if (isHidden) {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ROUTE GUARD (Now a standard function, NOT an IIFE)
// ─────────────────────────────────────────────────────────────────────────────

function redirectIfLoggedIn() {
    const path = window.location.pathname;
    const isAuthPage = path.endsWith("index.html") || path.endsWith("signup.html") || path === "/";

    // Because this is called inside DOMContentLoaded, we guarantee getToken exists
    if (getToken() && isAuthPage) {
        let toDashboard;

        if (path.includes("/Pages/")) {
            toDashboard = "dashboard.html";
        } else {
            toDashboard = "Pages/dashboard.html";
        }

        window.location.href = toDashboard;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EVENT BINDING (Everything triggers from here)
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
    // 1. Check if user should be redirected before doing anything else
    redirectIfLoggedIn();

    // 2. Bind the forms
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (signupForm) signupForm.addEventListener("submit", handleRegister);
});