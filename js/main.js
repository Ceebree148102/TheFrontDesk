// Modal Functions and Auth Integration
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function openContactModal() {
    document.getElementById('contactModal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    let loginModal = document.getElementById('loginModal');
    let signupModal = document.getElementById('signupModal');
    let contactModal = document.getElementById('contactModal');

    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
    if (event.target == contactModal) {
        contactModal.style.display = 'none';
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return alert(message);
    notification.textContent = message;
    notification.className = 'notification show ' + type;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Authentication helpers
const API_BASE = '';// relative path, will work when backend is co-hosted or proxied

async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

// Form Handlers (wired to backend)
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!email || !password) {
        showNotification('Please provide email and password', 'error');
        return;
    }

    try {
        const data = await apiPost('/api/auth/login', { email, password });
        localStorage.setItem('tfd_token', data.token);
        localStorage.setItem('tfd_user', JSON.stringify(data.user));
        showNotification('Login successful! Redirecting to chat...', 'success');
        setAuthUI();
        setTimeout(() => {
            closeLoginModal();
            form.reset();
            window.location.href = '/chat.html';
        }, 900);
    } catch (err) {
        console.error('Login error', err);
        showNotification(err.message || 'Login failed', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelectorAll('input[type="email"]')[0].value.trim();
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const agreeTerms = form.querySelector('input[type="checkbox"]').checked;

    if (!name || !email || !password) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    if (!agreeTerms) {
        showNotification('You must agree to the Terms of Service', 'error');
        return;
    }

    try {
        const data = await apiPost('/api/auth/register', { name, email, password });
        localStorage.setItem('tfd_token', data.token);
        localStorage.setItem('tfd_user', JSON.stringify(data.user));
        showNotification('Account created! Redirecting to chat...', 'success');
        setAuthUI();
        setTimeout(() => {
            closeSignupModal();
            form.reset();
            window.location.href = '/chat.html';
        }, 900);
    } catch (err) {
        console.error('Signup error', err);
        showNotification(err.message || 'Signup failed', 'error');
    }
}

// Contact form unchanged — still client-side unless you add an endpoint
async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const company = form.querySelectorAll('input[type="text"]')[1].value;
    const message = form.querySelector('textarea').value;

    if (name && email && phone && company && message) {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        console.log('Contact:', { name, email, phone, company, message });
        setTimeout(() => {
            closeContactModal();
            form.reset();
        }, 1500);
    }
}

// Logout
function logout() {
    localStorage.removeItem('tfd_token');
    localStorage.removeItem('tfd_user');
    setAuthUI();
    showNotification('Logged out', 'success');
}

// Update navigation auth UI
function setAuthUI() {
    const navButtons = document.querySelector('.nav-buttons');
    const token = localStorage.getItem('tfd_token');
    const user = JSON.parse(localStorage.getItem('tfd_user') || 'null');
    if (!navButtons) return;
    if (token && user) {
        navButtons.innerHTML = `
            <button class="btn" id="chatBtn">Chat</button>
            <div class="user-info">${escapeHtml(user.name)}</div>
            <button class="btn-logout" id="logoutBtn">Logout</button>
        `;
        const chatBtn = document.getElementById('chatBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        if (chatBtn) chatBtn.addEventListener('click', () => window.location.href = '/chat.html');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    } else {
        navButtons.innerHTML = `
            <button class="btn-login" onclick="openLoginModal()">Login</button>
            <button class="btn-signup" onclick="openSignupModal()">Sign Up</button>
        `;
    }
}

// Escape helper
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/\"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when link is clicked
const navItems = document.querySelectorAll('.nav-link');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Smooth scroll offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('TheFrontDesk website loaded successfully!');
    setAuthUI();

    // Attach form listeners if they exist
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const contactForm = document.getElementById('contactForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
});
