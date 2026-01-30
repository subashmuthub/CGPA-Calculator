# CGPA Calculator

A full-stack web application for calculating and tracking academic CGPA with user authentication using MongoDB.

## Features

### Authentication System
- **User Registration**: Secure signup with email verification
- **Email Verification**: Mandatory email verification before login
- **Login System**: JWT-based authentication
- **Password Security**: Bcrypt hashing with strong password requirements

### CGPA Calculator
- **Semester Management**: Add courses by semester and year
- **Grade Calculation**: Support for standard grade points (A+, A, A-, B+, B, etc.)
- **Real-time Calculation**: Automatic GPA calculation as you enter courses
- **CGPA Tracking**: Cumulative CGPA calculation across all semesters
- **Course Management**: Add/remove courses with validation

### Dashboard
- **Academic Overview**: Current CGPA, total credits, semester records
- **Progress Tracking**: Visual representation of academic performance
- **Recent Records**: Display of recent semester data
- **Quick Actions**: Easy access to calculator and data refresh

## Technology Stack

### Frontend
- **React 18**: Modern React with TypeScript
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Toastify**: User notifications
- **CSS3**: Custom styling with gradients and animations

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Nodemailer**: Email sending functionality
- **Express Validator**: Input validation and sanitization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account (for email verification)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Frontend setup
cd "cgpa-calculator"
npm install

# Backend setup
cd "../backend"
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/atlas
- Create a new cluster
- Get connection string
- Update MONGODB_URI in backend/.env

### 3. Email Configuration (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Environment Variables** in backend/.env

### 4. Environment Configuration

**Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cgpa-calculator
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cgpa-calculator

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

### 5. Build and Start

**Development Mode**
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd cgpa-calculator
npm start
```

**Production Mode**
```bash
# Build Backend
cd backend
npm run build
npm start

# Build Frontend
cd cgpa-calculator
npm run build
# Serve build folder with web server
```

## Application Flow

### 1. User Registration
- User signs up with first name, last name, email, and password
- Password must contain uppercase, lowercase, and number
- Verification email sent automatically
- User must verify email before login

### 2. Email Verification
- Click verification link in email
- Account activated for login

### 3. Login & Dashboard
- Login with verified email and password
- Dashboard shows CGPA overview and recent records
- Navigation to calculator and other features

### 4. CGPA Calculation
- Select semester and year
- Add courses with name, code, credits, and grade
- Real-time GPA calculation
- Save record to database
- Automatic cumulative CGPA calculation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `GET /api/auth/me` - Get current user

### CGPA Management
- `POST /api/cgpa/record` - Create/update CGPA record
- `GET /api/cgpa/records` - Get all user records
- `GET /api/cgpa/record/:id` - Get specific record
- `DELETE /api/cgpa/record/:id` - Delete record
- `GET /api/cgpa/grade-points` - Get grade point mapping

## Grade Point System

| Grade | Points |
|-------|--------|
| A+    | 4.0    |
| A     | 4.0    |
| A-    | 3.7    |
| B+    | 3.3    |
| B     | 3.0    |
| B-    | 2.7    |
| C+    | 2.3    |
| C     | 2.0    |
| C-    | 1.7    |
| D+    | 1.3    |
| D     | 1.0    |
| F     | 0.0    |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Email verification requirement
- CORS protection
- Error handling without sensitive data exposure

## File Structure

```
project-root/
├── cgpa-calculator/          # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── cgpa/        # CGPA calculator components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── common/      # Shared components
│   │   ├── context/         # React context (auth)
│   │   └── App.tsx          # Main app component
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Verify Gmail app password is correct
   - Check 2-factor authentication is enabled
   - Ensure EMAIL_USER and EMAIL_PASSWORD are set correctly

2. **MongoDB connection failed**
   - Check MongoDB service is running (local)
   - Verify connection string (Atlas)
   - Ensure network access is allowed (Atlas)

3. **CORS errors**
   - Frontend and backend URLs must match in configuration
   - Check CLIENT_URL in backend .env

4. **Build errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

### Database Reset
```javascript
// Connect to MongoDB and drop collections if needed
use cgpa-calculator;
db.users.drop();
db.cgparecords.drop();
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check troubleshooting section
- Review environment configuration
- Ensure all dependencies are installed correctly

---

**Note**: This application is designed for educational purposes and demonstrates full-stack development with authentication, database integration, and real-time calculations.