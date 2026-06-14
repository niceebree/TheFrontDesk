// ============================================
// TheFrontDesk - Dashboard JavaScript
// ============================================

let currentTab = 'profile';
let currentConversation = null;
let userProfiles = [];

// ============================================
// Initialize Dashboard
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    loadUserProfile();
    loadProfiles();
    loadConversations();
    updateUserGreeting();
});

function updateUserGreeting() {
    const greeting = document.getElementById('userGreeting');
    if (currentUser && greeting) {
        greeting.textContent = `Welcome, ${currentUser.firstName || 'User'}!`;
    }
}

// ============================================
// Tab Navigation
// ============================================

function switchTab(tabName) {
    event.preventDefault();

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Mark menu item as active
    event.target.closest('.menu-item').classList.add('active');
    currentTab = tabName;

    // Load tab-specific data
    if (tabName === 'discover') {
        loadProfiles();
    } else if (tabName === 'messages') {
        loadConversations();
    } else if (tabName === 'likes') {
        loadLikes();
    }
}

// ============================================
// Profile Management
// ============================================

function loadUserProfile() {
    try {
        const userProfile = JSON.parse(localStorage.getItem(`profile_${currentUser.id}`)) || {};

        document.getElementById('bio').value = userProfile.bio || '';

        // Load stats
        document.getElementById('viewCount').textContent = userProfile.views || 0;
        document.getElementById('likeCount').textContent = userProfile.likes || 0;
        document.getElementById('messageCount').textContent = userProfile.messages || 0;

        // Load photos
        if (userProfile.photos && userProfile.photos.length > 0) {
            document.getElementById('mainPhoto').src = userProfile.photos[0];
            userProfile.photos.forEach((photo, index) => {
                if (index > 0 && index <= 4) {
                    const slot = document.getElementById(`photo${index}`);
                    if (slot) {
                        slot.innerHTML = `<img src="${photo}" alt="Photo ${index}">`;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfile(event) {
    event.preventDefault();

    const bio = document.getElementById('bio').value;
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(input => input.value);

    const profile = {
        bio,
        interests,
        views: parseInt(document.getElementById('viewCount').textContent),
        likes: parseInt(document.getElementById('likeCount').textContent),
        messages: parseInt(document.getElementById('messageCount').textContent),
        photos: []
    };

    localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(profile));
    showNotification('Profile updated successfully!', 'success');
}

// ============================================
// Photo Upload
// ============================================

document.getElementById('photoUpload')?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    const photoSlots = ['mainPhoto', 'photo1', 'photo2', 'photo3', 'photo4'];
    let photoIndex = 0;

    files.slice(0, 5).forEach((file, index) => {
        if (file.type.startsWith('image/') && photoIndex < photoSlots.length) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const slotId = photoSlots[photoIndex];
                const element = document.getElementById(slotId);

                if (slotId === 'mainPhoto') {
                    element.src = event.target.result;
                } else {
                    element.innerHTML = `<img src="${event.target.result}" alt="Photo">`;
                }

                photoIndex++;
            };
            reader.readAsDataURL(file);
        }
    });

    showNotification('Photos uploaded successfully!', 'success');
});

// ============================================
// Profile Discovery
// ============================================

function loadProfiles() {
    try {
        // Mock data - replace with API call
        const mockProfiles = [
            {
                id: 'user_001',
                name: 'Sarah',
                age: 25,
                location: 'Nairobi',
                gender: 'Female',
                photo: 'https://via.placeholder.com/200?text=Sarah',
                bio: 'Adventure lover & foodie'
            },
            {
                id: 'user_002',
                name: 'Jessica',
                age: 23,
                location: 'Nairobi',
                gender: 'Female',
                photo: 'https://via.placeholder.com/200?text=Jessica',
                bio: 'Travel enthusiast'
            },
            {
                id: 'user_003',
                name: 'Emily',
                age: 26,
                location: 'Mombasa',
                gender: 'Female',
                photo: 'https://via.placeholder.com/200?text=Emily',
                bio: 'Beach lover'
            }
        ];

        userProfiles = mockProfiles;
        displayProfiles(mockProfiles);
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

function displayProfiles(profiles) {
    const grid = document.getElementById('profilesGrid');
    if (!grid) return;

    grid.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <div class="profile-photo">
                <img src="${profile.photo}" alt="${profile.name}">
                <div class="profile-overlay">
                    <button class="btn-action" onclick="likeProfile('${profile.id}')"><i class="fas fa-heart"></i></button>
                    <button class="btn-action" onclick="viewProfile('${profile.id}')"><i class="fas fa-info-circle"></i></button>
                </div>
            </div>
            <div class="profile-info">
                <h3>${profile.name}, ${profile.age}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${profile.location}</p>
                <p class="bio">${profile.bio}</p>
            </div>
        </div>
    `).join('');
}

function filterProfiles() {
    const genderFilter = document.getElementById('genderFilter').value;
    const locationFilter = document.getElementById('locationFilter').value.toLowerCase();

    let filtered = userProfiles;

    if (genderFilter) {
        filtered = filtered.filter(p => p.gender === genderFilter);
    }

    if (locationFilter) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(locationFilter));
    }

    displayProfiles(filtered);
}

function likeProfile(userId) {
    showNotification('Profile liked! ❤️', 'success');
    // API call to save like
}

function viewProfile(userId) {
    showNotification('Opening profile...', 'info');
    // Open profile detail modal
}

// ============================================
// Messaging
// ============================================

function loadConversations() {
    try {
        // Mock conversations
        const conversations = [
            { id: 'user_001', name: 'Sarah', lastMessage: 'Hey there! 😊', time: '5 mins' },
            { id: 'user_002', name: 'Jessica', lastMessage: 'Let\'s meet up', time: '1 hour' },
            { id: 'user_003', name: 'Emily', lastMessage: 'How are you?', time: '3 hours' }
        ];

        const conversationsList = document.getElementById('conversationsList');
        if (!conversationsList) return;

        conversationsList.innerHTML = conversations.map(conv => `
            <div class="conversation-item" onclick="openConversation('${conv.id}', '${conv.name}')">
                <div class="conversation-avatar">
                    <img src="https://via.placeholder.com/50?text=${conv.name[0]}" alt="${conv.name}">
                </div>
                <div class="conversation-info">
                    <h4>${conv.name}</h4>
                    <p>${conv.lastMessage}</p>
                </div>
                <span class="conversation-time">${conv.time}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

function openConversation(userId, userName) {
    currentConversation = { userId, userName };
    document.getElementById('chatWith').textContent = `Chat with ${userName}`;
    loadMessages(userId);
}

function loadMessages(userId) {
    // Mock messages
    const messages = [
        { senderId: userId, text: 'Hey! How are you?', timestamp: '2:30 PM' },
        { senderId: currentUser.id, text: 'I\'m doing great!', timestamp: '2:31 PM' },
        { senderId: userId, text: 'Would love to meet up', timestamp: '2:32 PM' }
    ];

    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;

    messagesList.innerHTML = messages.map(msg => `
        <div class="message ${msg.senderId === currentUser.id ? 'sent' : 'received'}">
            <p>${msg.text}</p>
            <span class="time">${msg.timestamp}</span>
        </div>
    `).join('');

    messagesList.scrollTop = messagesList.scrollHeight;
}

function sendMessage(event) {
    event.preventDefault();

    if (!currentConversation) {
        showNotification('Please select a conversation first', 'error');
        return;
    }

    const messageText = document.getElementById('messageText').value;
    if (!messageText.trim()) return;

    // Display message
    const messagesList = document.getElementById('messagesList');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
        <p>${messageText}</p>
        <span class="time">Just now</span>
    `;
    messagesList.appendChild(messageDiv);
    messagesList.scrollTop = messagesList.scrollHeight;

    // Clear input
    document.getElementById('messageText').value = '';

    // API call to send message
    // sendMessageAPI(currentConversation.userId, messageText);
}

// ============================================
// Likes
// ============================================

function loadLikes() {
    const likes = [
        { id: 'user_001', name: 'Sarah', photo: 'https://via.placeholder.com/150?text=Sarah' },
        { id: 'user_002', name: 'Jessica', photo: 'https://via.placeholder.com/150?text=Jessica' },
        { id: 'user_003', name: 'Emily', photo: 'https://via.placeholder.com/150?text=Emily' }
    ];

    const grid = document.getElementById('likesGrid');
    if (!grid) return;

    grid.innerHTML = likes.map(like => `
        <div class="like-card">
            <img src="${like.photo}" alt="${like.name}">
            <h3>${like.name}</h3>
            <button class="btn-primary" onclick="openConversation('${like.id}', '${like.name}')">Message</button>
        </div>
    `).join('');
}

// ============================================
// Subscription Management
// ============================================

function upgradePlan(planType) {
    showNotification(`Upgrading to ${planType}...`, 'info');
    // Redirect to payment page
    window.location.href = `payment.html?plan=${planType}`;
}

// ============================================
// Settings
// ============================================

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 8) {
        showNotification('Password changed successfully!', 'success');
        // API call to change password
    } else {
        showNotification('Password must be at least 8 characters', 'error');
    }
}

function deleteAccount() {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirm) {
        const confirmAgain = window.confirm('Type "DELETE" to confirm');
        if (confirmAgain) {
            localStorage.removeItem('currentUser');
            showNotification('Account deleted', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
}