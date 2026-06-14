// ==========================================
// THEFRONTDESK - COMPLETE JAVASCRIPT
// ==========================================

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});

// Scroll to Register Section
function scrollToRegister() {
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tabName === 'register') {
        document.getElementById('registerForm').classList.add('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } else if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.tab-button')[1].classList.add('active');
    }
}

// Password Strength Checker
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.className = 'password-strength';
    
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}

// Validate Email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Kenya Phone Number
function validatePhoneNumber(phone) {
    const phoneRegex = /^(\+?254|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// Validate Age (18+)
function validateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 18;
}

// Show Message
function showMessage(type, text) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    if (type === 'success') {
        document.getElementById('successText').textContent = text;
        successMsg.style.display = 'flex';
        errorMsg.style.display = 'none';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    } else if (type === 'error') {
        document.getElementById('errorText').textContent = text;
        errorMsg.style.display = 'flex';
        successMsg.style.display = 'none';
        
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

// ==========================================
// PHOTO GALLERY FUNCTIONALITY
// ==========================================

let uploadedPhotos = [];

function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    const galleryPreview = document.getElementById('galleryPreview');
    
    files.forEach((file, index) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('error', `File ${file.name} is too large. Maximum 5MB allowed.`);
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showMessage('error', `${file.name} is not a valid image file.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoObj = {
                id: Date.now() + index,
                src: e.target.result,
                name: file.name,
                uploadDate: new Date().toISOString()
            };
            
            uploadedPhotos.push(photoObj);
            displayPhoto(photoObj, galleryPreview);
            showMessage('success', `Photo "${file.name}" uploaded successfully!`);
        };
        
        reader.readAsDataURL(file);
    });
}

function displayPhoto(photoObj, container) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <img src="${photoObj.src}" alt="${photoObj.name}">
        <button class="delete-btn" onclick="deletePhoto(${photoObj.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(galleryItem);
}

function deletePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(p => p.id !== photoId);
    document.getElementById('galleryPreview').innerHTML = '';
    uploadedPhotos.forEach(photo => {
        displayPhoto(photo, document.getElementById('galleryPreview'));
    });
    showMessage('success', 'Photo deleted successfully!');
}

// ==========================================
// MESSAGING/CHAT FUNCTIONALITY
// ==========================================

let currentUser = null;
let chatMessages = [];

function selectUser(userElement) {
    document.querySelectorAll('.user-item').forEach(item => {
        item.style.background = 'white';
    });
    
    userElement.style.background = '#f0f0f0';
    currentUser = userElement.querySelector('.user-name').textContent;
    
    document.querySelector('.chat-header h3').textContent = `Chat with ${currentUser}`;
    document.getElementById('chatMessages').innerHTML = '';
    chatMessages = [];
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) {
        showMessage('error', 'Please type a message');
        return;
    }
    
    if (!currentUser) {
        showMessage('error', 'Please select a user to chat with');
        return;
    }
    
    // Add sent message
    const messageObj = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
    };
    
    chatMessages.push(messageObj);
    displayMessage(messageObj);
    messageInput.value = '';
    
    // Simulate reply after 1 second
    setTimeout(() => {
        const replyObj = {
            id: Date.now() + 1,
            text: `Thanks for your message! I'll get back to you soon.`,
            sender: 'other',
            timestamp: new Date().toLocaleTimeString()
        };
        chatMessages.push(replyObj);
        displayMessage(replyObj);
    }, 1000);
}

function displayMessage(messageObj) {
    const chatMessagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageObj.sender === 'user' ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">${messageObj.text}</div>
    `;
    
    chatMessagesDiv.appendChild(messageDiv);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

// Allow sending message with Enter key
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.target.id === 'messageInput') {
        sendMessage();
    }
});

// ==========================================
// PAYMENT FUNCTIONALITY
// ==========================================

let selectedPlan = {
    name: '',
    amount: 0
};

function initiatePayment(planName, amount) {
    selectedPlan.name = planName;
    selectedPlan.amount = amount;
    
    document.getElementById('planName').textContent = planName;
    document.getElementById('planAmount').textContent = `KES ${amount.toLocaleString()}`;
    document.getElementById('mpesaAmount').textContent = `KES ${amount.toLocaleString()}`;
    
    // Update WhatsApp link
    const whatsappLink = document.querySelector('.method-option input[value="whatsapp"] + label + .method-details a');
    if (whatsappLink) {
        const message = `I want to pay for ${planName} plan - KES ${amount}`;
        whatsappLink.href = `https://wa.me/254714810214?text=${encodeURIComponent(message)}`;
    }
    
    // Update email link
    const emailLink = document.querySelector('.method-option input[value="email"] + label + .method-details a');
    if (emailLink) {
        const subject = `Payment for ${planName} Plan - KES ${amount}`;
        emailLink.href = `mailto:hubdarkest@gmail.com?subject=${encodeURIComponent(subject)}`;
    }
    
    // Show payment modal
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Handle payment method selection
document.addEventListener('change', function(e) {
    if (e.target.name === 'paymentMethod') {
        document.querySelectorAll('.method-details').forEach(detail => {
            detail.style.display = 'none';
        });
        
        const selectedMethod = e.target.value;
        const detailId = selectedMethod + 'Details';
        const detailElement = document.getElementById(detailId);
        if (detailElement) {
            detailElement.style.display = 'block';
        }
    }
});

function confirmPayment() {
    const isConfirmed = document.getElementById('confirmPayment').checked;
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!isConfirmed) {
        showMessage('error', 'Please confirm your payment details');
        return;
    }
    
    if (selectedMethod === 'mpesa') {
        const username = document.getElementById('usernameRef').value.trim();
        if (!username) {
            showMessage('error', 'Please enter your username');
            return;
        }
        
        showMessage('success', `Payment initiated! Please send KES ${selectedPlan.amount} to 0781306215 using M-Pesa. Include "${username}" as the reference.`);
    } else if (selectedMethod === 'whatsapp') {
        showMessage('success', 'Redirecting to WhatsApp. Our team will assist you with payment.');
    } else if (selectedMethod === 'email') {
        showMessage('success', 'Invoice request sent! Check your email for payment details.');
    }
    
    setTimeout(() => {
        closePaymentModal();
        document.getElementById('confirmPayment').checked = false;
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target == modal) {
        closePaymentModal();
    }
};

// ==========================================
// REGISTRATION FUNCTIONALITY
// ==========================================

async function handleRegister(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!fullname.trim()) {
        showMessage('error', 'Please enter your full name');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    if (!validatePhoneNumber(phone)) {
        showMessage('error', 'Please enter a valid Kenyan phone number');
        return;
    }
    
    if (!username.trim()) {
        showMessage('error', 'Please choose a username');
        return;
    }
    
    if (!validateAge(dob)) {
        showMessage('error', 'You must be at least 18 years old to register');
        return;
    }
    
    if (!gender) {
        showMessage('error', 'Please select your gender');
        return;
    }
    
    if (!city) {
        showMessage('error', 'Please select your city');
        return;
    }
    
    if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
    }
    
    if (!terms) {
        showMessage('error', 'You must agree to the Terms of Service');
        return;
    }
    
    const userData = {
        fullname,
        email,
        phone,
        username,
        dateOfBirth: dob,
        gender,
        city,
        password: btoa(password),
        photos: uploadedPhotos,
        marketingConsent: document.getElementById('marketing').checked,
        registrationDate: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        
        showMessage('success', `Welcome ${fullname}! Your account has been created successfully. Upload some photos and start connecting!`);
        
        document.getElementById('registerForm').reset();
        document.getElementById('passwordStrength').className = 'password-strength';
        
        setTimeout(() => {
            switchTab('login');
        }, 2000);
        
    } catch (error) {
        showMessage('error', 'An error occurred during registration. Please try again.');
        console.error('Registration error:', error);
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;
    const remember = document.getElementById('remember').checked;
    
    if (!validateEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long');
        return;
    }
    
    try {
        const userData = localStorage.getItem(`user_${email}`);
        
        if (!userData) {
            showMessage('error', 'Email not found. Please register first.');
            return;
        }
        
        const user = JSON.parse(userData);
        const encodedPassword = btoa(password);
        
        if (user.password !== encodedPassword) {
            showMessage('error', 'Incorrect password. Please try again.');
            return;
        }
        
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        sessionStorage.setItem('currentUser', JSON.stringify({
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            loginTime: new Date().toISOString()
        }));
        
        showMessage('success', `Welcome back, ${user.fullname}!`);
        
        setTimeout(() => {
            alert('You are now logged in! Access dashboard: Browse profiles, upload more photos, and start connecting.');
            document.getElementById('loginForm').reset();
        }, 2000);
        
    } catch (error) {
        showMessage('error', 'An error occurred during login. Please try again.');
        console.error('Login error:', error);
    }
}

// Handle Contact Form
async function handleContactForm(event) {
    event.preventDefault();
    
    const name = event.target.name.value;
    const email = event.target.email.value;
    const subject = event.target.subject.value;
    const message = event.target.message.value;
    
    if (!name.trim()) {
        showMessage('error', 'Please enter your name');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    if (!subject.trim()) {
        showMessage('error', 'Please enter a subject');
        return;
    }
    
    if (!message.trim()) {
        showMessage('error', 'Please enter your message');
        return;
    }
    
    try {
        const contactData = {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`contact_${Date.now()}`, JSON.stringify(contactData));
        
        showMessage('success', 'Thank you for your message! We will contact you within 2 hours via WhatsApp or Email.');
        event.target.reset();
        
    } catch (error) {
        showMessage('error', 'An error occurred. Please try again.');
        console.error('Contact form error:', error);
    }
}

// Load remembered email on page load
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('login_email').value = rememberedEmail;
    }
});
