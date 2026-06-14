# TheFrontDesk - Complete Architecture Documentation

## 🏗️ System Architecture Overview

### Frontend Layer
- **Technology**: HTML5, CSS3, JavaScript (Vanilla)
- **Files**: index.html, css/styles.css, css/responsive.css, js/main.js
- **Features**:
  - Responsive design (Mobile-first approach)
  - Modern UI with gradient effects
  - Modal-based authentication
  - Real-time form validation
  - Photo upload with preview
  - Contact integration (WhatsApp, Email, Telegram)

### Backend Layer
- **Framework**: Express.js (Node.js)
- **Port**: 3000
- **Key Routes**:
  - Authentication: `/api/auth/register`, `/api/auth/login`
  - Profiles: `/api/profile/*`
  - Messaging: `/api/messages`
  - Payments: `/api/payments/*`
  - Subscriptions: `/api/subscriptions/*`
  - Discovery: `/api/discover`
  - Contact: `/api/contact`

### Database Layer
- **Database**: MongoDB (NoSQL)
- **Collections**:
  - users
  - profiles
  - messages
  - payments
  - subscriptions
  - interactions (likes, views)
  - matches
  - blocks
  - contactMessages
  - analytics

## 🔐 Security Features

### Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Password hashing with bcryptjs
- Token expiration (7 days)
- Authorization middleware for protected routes

### Data Protection
- Input validation on all endpoints
- CORS configuration for cross-origin requests
- Rate limiting (configurable)
- File upload validation (size, type)
- SQL injection prevention
- XSS protection

### Privacy
- User blocking system
- Report functionality
- Photo verification
- Email verification
- User data encryption

## 💳 Payment Integration

### Airtel Money
- Phone: +254 781 306 215
- Integration points: `/api/payments/airtel`
- Transaction tracking
- Payment status monitoring
- Receipt generation

### Supported Payment Methods
1. Airtel Money (Primary)
2. M-Pesa (Ready for integration)
3. Card Payments (Ready for integration)

## 📱 Contact Integration

### WhatsApp Business
- Number: +254 714 810 214
- Direct link: https://wa.me/254714810214
- Real-time customer support

### Telegram
- Group: TheFrontDesk
- Link: https://t.me/TheFrontDesk
- Community updates & support

### Email
- Support: hubdarkest@gmail.com
- Verification emails
- Payment receipts
- Support tickets

## 📊 Pricing Tiers

### Starter - KES 299/month
- Profile Creation
- Photo Upload (5 photos)
- Browse Profiles

### Premium - KES 799/month (Most Popular)
- Everything in Starter
- Unlimited Photos
- Unlimited Messaging
- Priority Support
- Profile Verification

### VIP - KES 1,499/month
- Everything in Premium
- VIP Badge
- Priority Matching
- Video Verification
- Dedicated Support

## 🔄 Key Features

### User Management
- Registration with email/phone verification
- Login with JWT tokens
- Profile customization
- Photo uploads (up to 5 for Starter, unlimited for Premium/VIP)
- Bio and interests management
- Preference settings

### Matching System
- Smart matching algorithm based on preferences
- Age range filtering
- Location-based discovery
- Gender preference filtering
- Interest-based recommendations

### Communication
- Direct messaging system
- Message read/unread status
- Message history
- Real-time notifications
- Message deletion

### Safety & Trust
- Profile verification badges
- User blocking
- Report system
- Photo verification
- Email/Phone verification
- Verified user badges

## 🚀 Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend Setup
1. Open `index.html` in a web browser
2. Or serve with: `python -m http.server 3001`
3. Configure API_BASE_URL in `js/main.js`

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your API keys
npm start
```

### Environment Variables
See `backend/.env.example` for all required variables

## 📈 Scalability Considerations

### Database
- Index on frequently queried fields
- Connection pooling
- Replication for high availability
- Sharding for large datasets

### API
- Load balancing with nginx/HAProxy
- Caching with Redis
- CDN for static assets
- API rate limiting

### File Storage
- AWS S3 for photo uploads
- CloudFront CDN for delivery
- Image optimization
- Backup system

## 🛠️ Future Enhancements

1. **Mobile Apps**
   - React Native / Flutter
   - Push notifications
   - Geolocation features

2. **Advanced Matching**
   - Machine learning recommendations
   - Behavior-based matching
   - Interest matching algorithm

3. **Social Features**
   - User reviews/ratings
   - Activity feed
   - Photo albums
   - Friends list

4. **Verification**
   - Video verification
   - ID verification
   - Two-factor authentication

5. **Analytics**
   - User engagement metrics
   - Conversion tracking
   - Revenue analytics
   - User retention analysis

## 📝 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  firstName, lastName, email, phone, age, gender,
  location, bio, password, photos
}
Response: { success, message, user, token }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, message, user, token }
```

### Profile Endpoints

#### Get Profile
```
GET /api/profile/:userId
Headers: Authorization: Bearer token
Response: { success, user, profile }
```

#### Update Profile
```
PUT /api/profile/:userId
Headers: Authorization: Bearer token
Body: { bio, interests, preferences }
Response: { success, message }
```

#### Upload Photos
```
POST /api/profile/:userId/photos
Headers: Authorization: Bearer token
Body: FormData with photos
Response: { success, message, photos }
```

### Messaging Endpoints

#### Send Message
```
POST /api/messages
Headers: Authorization: Bearer token
Body: { recipientId, text }
Response: { success, message, data }
```

#### Get Messages
```
GET /api/messages/:otherUserId
Headers: Authorization: Bearer token
Response: { success, messages }
```

## 📞 Support

- **Email**: hubdarkest@gmail.com
- **WhatsApp**: +254 714 810 214
- **Telegram**: @TheFrontDesk
- **Phone**: +254 781 306 215 (Airtel)
