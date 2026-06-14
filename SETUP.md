# TheFrontDesk - Installation & Setup Guide

## 📋 Prerequisites

- Node.js v14+ (https://nodejs.org/)
- MongoDB v4+ or MongoDB Atlas (https://www.mongodb.com/)
- Git
- npm or yarn
- Code Editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/niceebree/TheFrontDesk.git
cd TheFrontDesk
```

### 2. Frontend Setup

The frontend is pure HTML/CSS/JavaScript - no build process needed.

**Option A: Using Live Server (VS Code)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Frontend will open at `http://localhost:5500`

**Option B: Python Server**
```bash
python -m http.server 3001
```

**Option C: Node.js Server**
```bash
npm install -g http-server
http-server . -p 3001
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 4. Configure Environment Variables

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your_very_secure_jwt_secret_key_change_this
MONGODB_URI=mongodb://localhost:27017/thefrontdesk

# Airtel Money Configuration
AIRTEL_API_KEY=your_airtel_api_key
AIRTEL_MERCHANT_ID=your_merchant_id
AIRTEL_PHONE_NUMBER=+254781306215

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=hubdarkest@gmail.com

# WhatsApp
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER=+254714810214

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 5. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 6. Start Backend Server

```bash
# In backend directory
npm start

# Or with automatic restart on file changes
npm run dev  # requires nodemon
```

You should see:
```
╔═════════════════════════════════════════════╗
║  TheFrontDesk API Server Started            ║
║  Port: 3000                                 ║
║  Environment: development                   ║
╚═════════════════════════════════════════════╝
```

### 7. Access Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api

## 📱 Testing the Application

### Test Account
```
Email: test@example.com
Password: password123
Phone: 0712345678
```

### Test Registration
1. Click "Register" on homepage
2. Fill in test details
3. Upload test photos
4. Create account

### Test Payment Flow
1. Login to dashboard
2. Go to Subscription → Choose Premium
3. Proceed to payment
4. Use test phone: 0781306215
5. Complete payment

## 🔧 API Endpoints

### Authentication

**Register**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "0712345678",
  "age": 25,
  "gender": "Male",
  "location": "Nairobi",
  "password": "securepass123"
}
```

**Login**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Profile

**Get Profile**
```
GET http://localhost:3000/api/profile/user_id
Authorization: Bearer your_jwt_token
```

**Update Profile**
```
PUT http://localhost:3000/api/profile/user_id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "bio": "Updated bio",
  "interests": ["travel", "dining"]
}
```

## 📧 Email Configuration

### SendGrid Setup
1. Create account at https://sendgrid.com/
2. Generate API key
3. Add to `.env`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Gmail Setup (Alternative)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use in `.env`

## 💳 Payment Integration

### Airtel Money
1. Contact Airtel for merchant account
2. Get API credentials
3. Update in `.env`:
```env
AIRTEL_API_KEY=your_key
AIRTEL_MERCHANT_ID=your_merchant_id
```

### M-Pesa (Ready to integrate)
1. Sign up at https://developer.safaricom.co.ke/
2. Get consumer key and secret
3. Implement M-Pesa API endpoints

## 📲 WhatsApp Business Setup

1. Get WhatsApp Business number
2. Apply for Business API access
3. Generate API token
4. Update in `.env`:
```env
WHATSAPP_API_TOKEN=your_token
WHATSAPP_PHONE_ID=your_phone_id
```

## 🤖 Telegram Bot Setup

1. Create bot with @BotFather on Telegram
2. Get bot token
3. Create group "TheFrontDesk"
4. Add bot to group
5. Update in `.env`:
```env
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_GROUP_ID=group_id
```

## 🌐 Deployment

### Heroku Deployment (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create thefrontdesk-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret -a thefrontdesk-backend
heroku config:set MONGODB_URI=your_mongo_uri -a thefrontdesk-backend

# Deploy
git push heroku main
```

### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Test connection
mongo --version

# Start MongoDB
mongod
```

### CORS Errors
Update `backend/server.js`:
```javascript
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
```

## 📚 File Structure

```
TheFrontDesk/
├── index.html              # Homepage
├── dashboard.html          # User dashboard
├── payment.html           # Payment page
├── css/
│   ├── styles.css        # Main styles
│   ├── responsive.css    # Mobile responsive
│   └── dashboard.css     # Dashboard styles
├── js/
│   ├── main.js           # Global JS
│   └── dashboard.js      # Dashboard JS
├── backend/
│   ├── server.js         # Express server
│   ├── package.json
│   ├── .env.example
│   └── database/
│       └── schema.mongodb
├── ARCHITECTURE.md
└── SETUP.md
```

## 📞 Support

- **Email**: hubdarkest@gmail.com
- **WhatsApp**: +254 714 810 214
- **Telegram**: @TheFrontDesk
- **Airtel**: +254 781 306 215

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Frontend accessible at localhost:3001
- [ ] Backend accessible at localhost:3000
- [ ] Test registration working
- [ ] Test login working
- [ ] Test dashboard loading
- [ ] Environment variables configured
- [ ] Payment test completed

## 📄 License

Private - For authorized use only
