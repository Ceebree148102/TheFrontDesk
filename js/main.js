// Modal Functions
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

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // Validate
    if (email && password) {
        showNotification('Login successful! Redirecting...', 'success');
        // Here you would typically send data to a backend
        console.log('Login:', { email, password });
        setTimeout(() => {
            closeLoginModal();
            form.reset();
        }, 1500);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelectorAll('input[type="email"]')[0].value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const agreeTerms = form.querySelector('input[type="checkbox"]').checked;

    // Validate
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (name && email && password && agreeTerms) {
        showNotification('Account created successfully! Welcome to TheFrontDesk!', 'success');
        console.log('Signup:', { name, email, password });
        setTimeout(() => {
            closeSignupModal();
            form.reset();
        }, 1500);
    }
}

function handleContactSubmit(event) {
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

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + type;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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
        navLinks.classList.remove('active');
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
});
