// ============================================
// TheFrontDesk - Backend Server (Node.js/Express)
// ============================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/photos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ============================================
// In-Memory Database (Replace with MongoDB/PostgreSQL)
// ============================================

let users = [];
let messages = [];
let payments = [];
let profiles = [];
let subscriptions = [];

// ============================================
// Middleware - JWT Authentication
// ============================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// ============================================
// Authentication Routes
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, age, gender, location, bio, password, photos } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password || age < 18) {
            return res.status(400).json({ success: false, message: 'Invalid registration data' });
        }

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: 'user_' + Date.now(),
            firstName,
            lastName,
            email,
            phone,
            age,
            gender,
            location,
            bio,
            password: hashedPassword,
            verified: false,
            verificationCode: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            subscription: 'free',
            subscriptionEndDate: null
        };

        users.push(newUser);

        // Create profile
        const profile = {
            userId: newUser.id,
            photos: photos || [],
            bio: bio || '',
            interests: [],
            preferences: {},
            views: 0,
            likes: 0,
            createdAt: new Date()
        };
        profiles.push(profile);

        // Generate JWT
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'your_secret_key', {
            expiresIn: '7d'
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: { id: newUser.id, firstName, lastName, email },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', {
            expiresIn: '7d'
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// ============================================
// Profile Routes
// ============================================

// Get user profile
app.get('/api/profile/:userId', authenticateToken, (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.userId);
        const profile = profiles.find(p => p.userId === req.params.userId);

        if (!user || !profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                gender: user.gender,
                location: user.location,
                bio: user.bio,
                verified: user.verified,
                subscription: user.subscription,
                createdAt: user.createdAt
            },
            profile: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
    }
});

// Update profile
app.put('/api/profile/:userId', authenticateToken, (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { bio, interests, preferences } = req.body;
        const profile = profiles.find(p => p.userId === req.params.userId);

        if (bio) user.bio = bio;
        if (interests) profile.interests = interests;
        if (preferences) profile.preferences = preferences;

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});

// Upload photos
app.post('/api/profile/:userId/photos', authenticateToken, upload.array('photos', 5), (req, res) => {
    try {
        const profile = profiles.find(p => p.userId === req.params.userId);
        if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

        const photoUrls = req.files.map(file => ({
            url: `/uploads/photos/${file.filename}`,
            filename: file.filename,
            uploadedAt: new Date()
        }));

        profile.photos = profile.photos.concat(photoUrls);

        res.json({
            success: true,
            message: 'Photos uploaded successfully',
            photos: photoUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading photos', error: error.message });
    }
});

// ============================================
// Messaging Routes
// ============================================

// Send message
app.post('/api/messages', authenticateToken, (req, res) => {
    try {
        const { recipientId, text } = req.body;

        const message = {
            id: 'msg_' + Date.now(),
            senderId: req.user.id,
            recipientId,
            text,
            read: false,
            createdAt: new Date()
        };

        messages.push(message);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
});

// Get messages between two users
app.get('/api/messages/:otherUserId', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;

        const userMessages = messages.filter(m => {
            return (m.senderId === userId && m.recipientId === otherUserId) ||
                   (m.senderId === otherUserId && m.recipientId === userId);
        });

        res.json({
            success: true,
            messages: userMessages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
    }
});

// Mark message as read
app.put('/api/messages/:messageId/read', authenticateToken, (req, res) => {
    try {
        const message = messages.find(m => m.id === req.params.messageId);
        if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

        message.read = true;

        res.json({ success: true, message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating message', error: error.message });
    }
});

// ============================================
// Payment Routes (Airtel Money Integration)
// ============================================

// Initiate Airtel Money payment
app.post('/api/payments/airtel', authenticateToken, (req, res) => {
    try {
        const { amount, phoneNumber, description } = req.body;

        // Validate payment data
        if (!amount || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'Amount and phone number required' });
        }

        // Airtel Money API Integration (Pseudo code)
        // In production, integrate with actual Airtel Money API
        const transactionId = 'TFD_' + Date.now();

        const payment = {
            id: transactionId,
            userId: req.user.id,
            amount,
            phoneNumber,
            description,
            status: 'pending',
            method: 'airtel_money',
            createdAt: new Date()
        };

        payments.push(payment);

        res.json({
            success: true,
            message: 'Payment initiated',
            transactionId: transactionId,
            redirectUrl: 'https://airtel.co.ke' // Redirect to Airtel payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment error', error: error.message });
    }
});

// Get payment status
app.get('/api/payments/:transactionId', authenticateToken, (req, res) => {
    try {
        const payment = payments.find(p => p.id === req.params.transactionId);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

        res.json({
            success: true,
            payment: payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching payment', error: error.message });
    }
});

// ============================================
// Subscription Routes
// ============================================

// Get subscription plans
app.get('/api/subscriptions/plans', (req, res) => {
    const plans = [
        {
            id: 'plan_starter',
            name: 'Starter',
            price: 299,
            currency: 'KES',
            duration: 'month',
            features: [
                'Profile Creation',
                'Photo Upload (5 photos)',
                'Browse Profiles'
            ]
        },
        {
            id: 'plan_premium',
            name: 'Premium',
            price: 799,
            currency: 'KES',
            duration: 'month',
            features: [
                'Everything in Starter',
                'Unlimited Photos',
                'Unlimited Messaging',
                'Priority Support',
                'Profile Verification'
            ]
        },
        {
            id: 'plan_vip',
            name: 'VIP',
            price: 1499,
            currency: 'KES',
            duration: 'month',
            features: [
                'Everything in Premium',
                'VIP Badge',
                'Priority Matching',
                'Video Verification',
                'Dedicated Support'
            ]
        }
    ];

    res.json({ success: true, plans: plans });
});

// Subscribe to plan
app.post('/api/subscriptions/subscribe', authenticateToken, (req, res) => {
    try {
        const { planId, paymentMethod } = req.body;
        const user = users.find(u => u.id === req.user.id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Calculate subscription end date (30 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        user.subscription = planId;
        user.subscriptionEndDate = endDate;

        const subscription = {
            id: 'sub_' + Date.now(),
            userId: user.id,
            planId: planId,
            startDate: new Date(),
            endDate: endDate,
            status: 'active'
        };

        subscriptions.push(subscription);

        res.json({
            success: true,
            message: 'Subscription successful',
            subscription: subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Subscription error', error: error.message });
    }
});

// ============================================
// Discovery Routes (Browse Profiles)
// ============================================

// Get profiles for discovery
app.get('/api/discover', authenticateToken, (req, res) => {
    try {
        const { page = 1, limit = 10, gender, location } = req.query;
        const skip = (page - 1) * limit;

        let filteredProfiles = profiles.filter(p => p.userId !== req.user.id);

        if (gender) {
            filteredProfiles = filteredProfiles.filter(p => {
                const user = users.find(u => u.id === p.userId);
                return user && user.gender === gender;
            });
        }

        if (location) {
            filteredProfiles = filteredProfiles.filter(p => {
                const user = users.find(u => u.id === p.userId);
                return user && user.location.toLowerCase().includes(location.toLowerCase());
            });
        }

        const paginatedProfiles = filteredProfiles.slice(skip, skip + parseInt(limit));

        res.json({
            success: true,
            profiles: paginatedProfiles,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredProfiles.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profiles', error: error.message });
    }
});

// ============================================
// Contact Routes
// ============================================

// Send contact message
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // In production, send email via service like SendGrid
        console.log('Contact message received:', { name, email, subject, message });

        res.json({
            success: true,
            message: 'Contact message sent successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending contact message', error: error.message });
    }
});

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ============================================
// Server Startup
// ============================================

app.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║  TheFrontDesk API Server Started    ║`);
    console.log(`║  Port: ${PORT}`);
    console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`╚══════════════════════════════════════╝\n`);
});

module.exports = app;