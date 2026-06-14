// ============================================
// TheFrontDesk - Frontend JavaScript
// ============================================

// Global Variables
const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let uploadedPhotos = [];

// ============================================
// Modal Management
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function toggleModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (loginModal.classList.contains('show')) {
        closeModal('loginModal');
        openModal('registerModal');
    } else {
        closeModal('registerModal');
        openModal('loginModal');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) closeModal('loginModal');
    if (event.target === registerModal) closeModal('registerModal');
});

// ============================================
// Photo Upload Handler
// ============================================

const photoInput = document.getElementById('reg-photos');
if (photoInput) {
    photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const photoPreview = document.getElementById('photo-preview');
        photoPreview.innerHTML = ''; // Clear previous previews
        uploadedPhotos = [];

        files.slice(0, 5).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedPhotos.push({
                        name: file.name,
                        data: event.target.result,
                        type: file.type
                    });
                    
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    photoPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// ============================================
// Authentication Handlers
// ============================================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate API call
    const loginData = {
        email: email,
        password: password,
        timestamp: new Date().toISOString()
    };
    
    console.log('Login attempt:', loginData);
    
    // Simulate successful login
    setTimeout(() => {
        const userData = {
            id: 'user_' + Date.now(),
            email: email,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        currentUser = userData;
        
        showNotification('Login successful!', 'success');
        closeModal('loginModal');
        
        // Reset form
        event.target.reset();
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 500);
}

function handleRegister(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('reg-firstname').value,
        lastName: document.getElementById('reg-lastname').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        age: parseInt(document.getElementById('reg-age').value),
        gender: document.getElementById('reg-gender').value,
        location: document.getElementById('reg-location').value,
        bio: document.getElementById('reg-bio').value,
        password: document.getElementById('reg-password').value,
        confirmPassword: document.getElementById('reg-confirm-password').value,
        photos: uploadedPhotos,
        timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!validateRegistration(formData)) {
        return;
    }
    
    console.log('Registration data:', formData);
    
    // Simulate API call
    setTimeout(() => {
        const userData = {
            id: 'user_' + Date.now(),
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        currentUser = userData;
        
        showNotification('Account created successfully! Redirecting...', 'success');
        closeModal('registerModal');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

function validateRegistration(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Invalid email address', 'error');
        return false;
    }
    
    // Age validation
    if (data.age < 18) {
        showNotification('You must be at least 18 years old', 'error');
        return false;
    }
    
    // Password validation
    if (data.password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return false;
    }
    
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    return true;
}

// ============================================
// Pricing Plan Selection
// ============================================

function selectPlan(planName) {
    if (!currentUser) {
        showNotification('Please login or register first', 'info');
        openModal('registerModal');
        return;
    }
    
    const planData = {
        user_id: currentUser.id,
        plan: planName,
        selected_at: new Date().toISOString()
    };
    
    console.log('Plan selected:', planData);
    
    showNotification(`${planName} plan selected! Proceeding to payment...`, 'success');
    
    // Redirect to payment
    setTimeout(() => {
        window.location.href = `payment.html?plan=${planName}`;
    }, 1500);
}

// ============================================
// Payment Integration
// ============================================

function initiateAirtelPayment(amount, phoneNumber, description) {
    const paymentData = {
        amount: amount,
        phoneNumber: phoneNumber,
        description: description,
        timestamp: new Date().toISOString(),
        requestId: 'TFD_' + Date.now()
    };
    
    console.log('Airtel payment initiated:', paymentData);
    
    // API Call to backend
    fetch(`${API_BASE_URL}/payments/airtel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Payment initiated. Check your phone for prompt.', 'success');
            savePaymentRecord(data.transactionId, paymentData);
        } else {
            showNotification('Payment failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        showNotification('Payment processing error', 'error');
    });
}

function savePaymentRecord(transactionId, paymentData) {
    const record = {
        transactionId: transactionId,
        userId: currentUser.id,
        amount: paymentData.amount,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    let payments = JSON.parse(localStorage.getItem('payments')) || [];
    payments.push(record);
    localStorage.setItem('payments', JSON.stringify(payments));
}

// ============================================
// Messaging System
// ============================================

function sendMessage(recipientId, messageText) {
    if (!currentUser) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const message = {
        senderId: currentUser.id,
        recipientId: recipientId,
        text: messageText,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // API Call
    fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Message sent:', data);
            displayMessage(message);
        }
    })
    .catch(error => console.error('Message error:', error));
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + (message.senderId === currentUser.id ? 'sent' : 'received');
    messageElement.innerHTML = `
        <p>${escapeHtml(message.text)}</p>
        <span class="time">${new Date(message.timestamp).toLocaleTimeString()}</span>
    `;
    
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// Utility Functions
// ============================================

function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    currentUser = null;
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ============================================
// Hamburger Menu
// ============================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        hamburger.classList.toggle('active');
    });
}

// Close menu on link click
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

// ============================================
// Document Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('TheFrontDesk initialized');
    
    // Check if user is logged in
    if (currentUser) {
        console.log('Current user:', currentUser);
    }
    
    // Add slide animation for CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// Contact Direct Links
// ============================================

function contactViaWhatsApp() {
    window.open('https://wa.me/254714810214?text=Hello%20TheFrontDesk', '_blank');
}

function contactViaEmail() {
    window.location.href = 'mailto:hubdarkest@gmail.com?subject=TheFrontDesk%20Inquiry';
}

function contactViaTelegram() {
    window.open('https://t.me/TheFrontDesk', '_blank');
}

function callAirtel() {
    window.location.href = 'tel:+254781306215';
}