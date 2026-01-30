# Quick Render Deployment

## 1️⃣ MongoDB Atlas Setup (5 minutes)
- Create account at https://cloud.mongodb.com
- Create free M0 cluster
- Add database user (username + password)
- Whitelist all IPs (0.0.0.0/0)
- Get connection string:
  ```
  mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/cgpa-calculator?retryWrites=true&w=majority
  ```

## 2️⃣ Deploy Backend (5 minutes)
- Go to https://dashboard.render.com
- New → Web Service
- Connect GitHub repo: `CGPA-Calculator`
- Settings:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  MONGODB_URI=<your-mongodb-connection-string>
  JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
  EMAIL_USER=<your-gmail>
  EMAIL_PASSWORD=<gmail-app-password>
  ```
- Create Service
- Copy backend URL: `https://cgpa-calculator-backend.onrender.com`

## 3️⃣ Deploy Frontend (5 minutes)
- New → Static Site
- Connect same GitHub repo
- Settings:
  - Root Directory: `cgpa-calculator`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
- Environment Variables:
  ```
  REACT_APP_API_URL=<your-backend-url>
  ```
- Create Static Site
- Copy frontend URL: `https://cgpa-calculator-frontend.onrender.com`

## 4️⃣ Update Backend CORS
- Go back to backend service
- Add environment variable:
  ```
  FRONTEND_URL=<your-frontend-url>
  ```
- Save (auto-redeploys)

## ✅ Done!
Visit your frontend URL and test the app!

---

**Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

**See full guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
