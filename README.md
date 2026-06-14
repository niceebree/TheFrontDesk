# README.md

# 🎉 TheFrontDesk - Premium Hookup Services Platform

[![License: Private](https://img.shields.io/badge/License-Private-red)]()
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4.0+-blue)]()
[![Express.js](https://img.shields.io/badge/Express.js-Latest-black)]()

## 📖 Overview

**TheFrontDesk** is a comprehensive, full-stack web application for premium hookup services at affordable Kenyan rates. Built with modern technologies, it features a responsive frontend, robust backend API, secure payment processing, and integrated communication channels.

### ✨ Key Features

- ✅ **User Authentication** - Secure JWT-based authentication
- ✅ **Profile Management** - Upload photos, customize bio, set preferences
- ✅ **Smart Matching** - AI-powered profile discovery and matching
- ✅ **Real-Time Messaging** - Direct communication between users
- ✅ **Payment Integration** - Airtel Money, M-Pesa support
- ✅ **Subscription Plans** - Flexible pricing tiers
- ✅ **Safety Features** - Profile verification, user blocking, reporting
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **24/7 Support** - WhatsApp, Email, Telegram integration

## 🏗️ Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Responsive Design
- Modern UI/UX

### Backend
- **Framework**: Express.js (Node.js)
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Validation**: Custom middleware

### Database
- **Primary**: MongoDB (NoSQL)
- **Collections**: Users, Profiles, Messages, Payments, Subscriptions, etc.

### Services
- **Payment**: Airtel Money, M-Pesa
- **Email**: SendGrid / Gmail
- **SMS**: Twilio (ready to integrate)
- **Chat**: WhatsApp Business API
- **Community**: Telegram Bot

## 🎯 Pricing Tiers

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | KES 299/mo | Profile, 5 Photos, Browse |
| **Premium** | KES 799/mo | Unlimited Photos, Messaging, Verified Badge |
| **VIP** | KES 1,499/mo | Priority Matching, VIP Badge, Video Verification |

## 📱 Contact Information

- **WhatsApp**: [+254 714 810 214](https://wa.me/254714810214)
- **Telegram**: [@TheFrontDesk](https://t.me/TheFrontDesk)
- **Email**: hubdarkest@gmail.com
- **Airtel Money**: +254 781 306 215

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js v14+
- MongoDB
- npm or yarn
```

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/niceebree/TheFrontDesk.git
   cd TheFrontDesk
   ```

2. **Setup Frontend**
   ```bash
   # Serve static files
   python -m http.server 3001
   # Or use Live Server in VS Code
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000/api

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Setup & Installation Guide](./SETUP.md)
- [API Documentation](./backend/README.md)
- [Database Schema](./backend/database/schema.mongodb)

## 📁 Project Structure

```
TheFrontDesk/
├── index.html                    # Landing page
├── dashboard.html               # User dashboard
├── payment.html                # Payment page
├── css/
│   ├── styles.css             # Main styles
│   ├── responsive.css         # Mobile styles
│   └── dashboard.css          # Dashboard styles
├── js/
│   ├── main.js               # Global JS functions
│   └── dashboard.js          # Dashboard logic
├── backend/
│   ├── server.js             # Express server
│   ├── package.json
│   ├── .env.example
│   └── database/
│       └── schema.mongodb    # Database schema
├── ARCHITECTURE.md           # System architecture
├── SETUP.md                 # Setup guide
└── README.md               # This file
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Data Encryption**: SSL/TLS in production
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured CORS headers
- **File Upload Validation**: MIME type & size checks
- **Rate Limiting**: Prevents abuse
- **User Privacy**: Profile visibility controls

## 💳 Payment Processing

### Supported Methods
1. **Airtel Money** - Primary payment gateway
2. **M-Pesa** - Ready for integration
3. **Card Payments** - Future enhancement

### Features
- Secure transaction processing
- Real-time payment status
- Automated receipts
- Transaction history
- Failed payment handling

## 📞 Support Channels

### WhatsApp Business
- Direct messaging
- Quick responses
- Support tickets
- **Link**: https://wa.me/254714810214

### Telegram Community
- Group discussions
- Updates & announcements
- Community support
- **Link**: https://t.me/TheFrontDesk

### Email Support
- Detailed inquiries
- Account issues
- Technical support
- **Email**: hubdarkest@gmail.com

## 🔄 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profile
- `GET /api/profile/:userId` - Get profile
- `PUT /api/profile/:userId` - Update profile
- `POST /api/profile/:userId/photos` - Upload photos

### Messaging
- `POST /api/messages` - Send message
- `GET /api/messages/:otherUserId` - Get conversation
- `PUT /api/messages/:messageId/read` - Mark as read

### Discovery
- `GET /api/discover` - Browse profiles
- `POST /api/payments/airtel` - Initiate payment
- `GET /api/subscriptions/plans` - Get plans

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, smooth transitions
- **Responsive Layout**: Mobile-first approach
- **Dark Mode Support**: Easy on the eyes
- **Smooth Animations**: Professional feel
- **Intuitive Navigation**: User-friendly interface
- **Form Validation**: Real-time feedback
- **Loading States**: User feedback
- **Error Handling**: Helpful error messages

## 📊 Future Enhancements

- [ ] Mobile app (React Native / Flutter)
- [ ] Advanced matching algorithm
- [ ] Video verification
- [ ] User reviews & ratings
- [ ] Activity feed
- [ ] Photo albums
- [ ] Two-factor authentication
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Multi-language support

## 🤝 Contributing

This is a private project. For contributions, please contact the development team.

## 📄 License

This project is **Private** and proprietary. Unauthorized reproduction, distribution, or use is prohibited.

## 👤 Author

**TheFrontDesk Team**
- Email: hubdarkest@gmail.com
- WhatsApp: +254 714 810 214
- Telegram: @TheFrontDesk

## 🙋 Support & Contact

For support, feature requests, or inquiries:

1. **WhatsApp**: https://wa.me/254714810214
2. **Email**: hubdarkest@gmail.com
3. **Telegram**: https://t.me/TheFrontDesk
4. **Phone**: +254 781 306 215 (Airtel Money)

---

<p align="center">
  <strong>TheFrontDesk - Premium Hookup Services at Affordable Kenyan Rates</strong>
</p>
<p align="center">
  Made with ❤️ in Kenya
</p>