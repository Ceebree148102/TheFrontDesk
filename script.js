// ============ Modal Functions ============
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('active');
    document.getElementById('signupModal').style.display = 'flex';
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

function openPhotoUpload() {
    document.getElementById('photoUploadModal').classList.add('active');
    document.getElementById('photoUploadModal').style.display = 'flex';
}

function closePhotoUpload() {
    document.getElementById('photoUploadModal').classList.remove('active');
    document.getElementById('photoUploadModal').style.display = 'none';
    document.getElementById('photoPreview').style.display = 'none';
}

// ============ Authentication Functions ============
const users = JSON.parse(localStorage.getItem('thefrontdesk_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('thefrontdesk_currentUser')) || null;

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        showDashboard();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    const photoUploadForm = document.getElementById('photoUploadForm');
    if (photoUploadForm) {
        photoUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePhotoUpload();
        });
    }

    // Photo upload drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            document.getElementById('photoFile').click();
        });

        document.getElementById('photoFile').addEventListener('change', function(e) {
            previewPhoto(e);
        });
    }
});

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(user));
        alert('Login successful!');
        closeLoginModal();
        showDashboard();
    } else {
        alert('Invalid email or password!');
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        alert('Email already registered!');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString(),
        photos: [],
        posts: []
    };

    users.push(newUser);
    localStorage.setItem('thefrontdesk_users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(newUser));

    alert('Account created successfully!');
    closeSignupModal();
    showDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('thefrontdesk_currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginForm').reset();
    alert('Logged out successfully!');
    window.scrollTo(0, 0);
}

// ============ Dashboard Functions ============
function showDashboard() {
    document.getElementById('dashboard').style.display = 'flex';
    document.querySelector('nav').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.about').style.display = 'none';
    document.querySelector('.contact').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    updateProfileDisplay();
    loadPosts();
    showSection('feed');
}

function updateProfileDisplay() {
    if (currentUser) {
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profilePhone').textContent = currentUser.phone;
    }
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Hide all nav items
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');

    // Highlight nav item
    event.target.closest('.nav-item').classList.add('active');

    if (sectionName === 'photos') {
        loadPhotos();
    } else if (sectionName === 'feed') {
        loadPosts();
    }
}

// ============ Post Functions ============
function createPost() {
    const postInput = document.getElementById('postInput');
    const content = postInput.value.trim();

    if (!content) {
        alert('Please write something!');
        return;
    }

    const post = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.name,
        content,
        image: null,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: []
    };

    currentUser.posts = currentUser.posts || [];
    currentUser.posts.push(post);
    localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(currentUser));

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('thefrontdesk_users', JSON.stringify(users));
    }

    postInput.value = '';
    loadPosts();
    alert('Post created successfully!');
}

function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    if (!currentUser.posts || currentUser.posts.length === 0) {
        postsContainer.innerHTML = '<p style="text-align: center; color: #999;">No posts yet. Create your first post!</p>';
        return;
    }

    currentUser.posts.forEach(post => {
        const postCard = createPostElement(post);
        postsContainer.appendChild(postCard);
    });
}

function createPostElement(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const initials = post.username.split(' ').map(n => n[0]).join('').toUpperCase();

    card.innerHTML = `
        <div class="post-header">
            <div class="user-avatar">${initials}</div>
            <div class="post-info">
                <p class="username">${post.username}</p>
                <p class="post-time">${post.timestamp}</p>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
        </div>
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post"></div>` : ''}
        <div class="post-actions">
            <button class="action-btn" onclick="likePost(${post.id})"><i class="fas fa-heart"></i> Like (${post.likes})</button>
            <button class="action-btn"><i class="fas fa-comment"></i> Comment</button>
            <button class="action-btn"><i class="fas fa-share"></i> Share</button>
        </div>
    `;

    return card;
}

function likePost(postId) {
    const post = currentUser.posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(currentUser));
        loadPosts();
    }
}

// ============ Photo Functions ============
function handlePhotoUpload() {
    const file = document.getElementById('photoFile').files[0];
    const caption = document.getElementById('photoCaption').value;

    if (!file) {
        alert('Please select a photo!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const photo = {
            id: Date.now(),
            src: e.target.result,
            caption: caption,
            uploadDate: new Date().toLocaleString()
        };

        currentUser.photos = currentUser.photos || [];
        currentUser.photos.push(photo);
        localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(currentUser));

        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('thefrontdesk_users', JSON.stringify(users));
        }

        alert('Photo uploaded successfully!');
        closePhotoUpload();
        loadPhotos();
    };
    reader.readAsDataURL(file);
}

function loadPhotos() {
    const photosGallery = document.getElementById('photosGallery');
    photosGallery.innerHTML = '';

    if (!currentUser.photos || currentUser.photos.length === 0) {
        photosGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No photos uploaded yet.</p>';
        return;
    }

    currentUser.photos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="Photo">
            <div class="photo-overlay">
                <button class="btn-delete" onclick="deletePhoto(${photo.id})"><i class="fas fa-trash"></i></button>
            </div>
            <p style="padding: 0.5rem; font-size: 0.9rem; color: #666;">${photo.caption || 'No caption'}</p>
        `;
        photosGallery.appendChild(photoCard);
    });
}

function deletePhoto(photoId) {
    if (confirm('Are you sure you want to delete this photo?')) {
        currentUser.photos = currentUser.photos.filter(p => p.id !== photoId);
        localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(currentUser));
        loadPhotos();
    }
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('photoFile').files = files;
        previewPhoto({ target: { files } });
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
}

// ============ Messaging Functions ============
function openNewChat() {
    if (typeof Tawk_API !== 'undefined') {
        Tawk_API.maximize();
    }
}


function openConversation() {
    alert('Message feature under development!');
}

function editProfile() {
    const newName = prompt('Enter new name:', currentUser.name);
    if (newName) {
        currentUser.name = newName;
        localStorage.setItem('thefrontdesk_currentUser', JSON.stringify(currentUser));
        updateProfileDisplay();
        alert('Profile updated successfully!');
    }
}

// ============ Close Modals on Click Outside ============
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const photoModal = document.getElementById('photoUploadModal');

    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === photoModal) {
        closePhotoUpload();
    }
}
