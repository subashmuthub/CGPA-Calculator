# 🚀 Deploying CGPA Calculator to Render

This guide will walk you through deploying your CGPA Calculator application to Render with MongoDB Atlas.

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub ✓
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Free MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a new account
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier
5. Choose a cloud provider and region (select one close to your users)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these - you'll need them!)
5. Set **"Built-in Role"** to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is safe for MongoDB Atlas as it still requires authentication
4. Click **"Confirm"**

### 1.4 Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):

   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. Replace `<username>` and `<password>` with your database user credentials
6. Add `/cgpa-calculator` before the `?` to specify the database name:

   ```text
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cgpa-calculator?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your **"CGPA-Calculator"** repository
5. Configure the service:

   **Basic Settings:**
   - **Name:** `cgpa-calculator-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Instance Type:**
   - Select **"Free"**

### 2.2 Add Environment Variables

Scroll down to **"Environment Variables"** section and add these:

| Key              | Value                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------||
| `NODE_ENV`       | `production`                                                                                       |
| `MONGODB_URI`    | Your MongoDB Atlas connection string from Step 1.4                                                 |
| `JWT_SECRET`     | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`         |
| `EMAIL_USER`     | Your Gmail address (e.g., `youremail@gmail.com`)                                                   |
| `EMAIL_PASSWORD` | Your Gmail App Password (see below)                                                                |
| `FRONTEND_URL`   | Leave blank for now (we'll add this after deploying frontend)                                      |

**How to get Gmail App Password:**

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select app: "Mail", Select device: "Other" (enter "CGPA Calculator")
4. Click "Generate"
5. Copy the 16-character password

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll see your backend URL:

   ```text
   https://cgpa-calculator-backend.onrender.com
   ```

4. **SAVE THIS URL** - you'll need it for frontend configuration

### 2.4 Test Backend

Visit: `https://cgpa-calculator-backend.onrender.com/health`

You should see:

```json
{"status": "Server is running!"}
```

---

## Step 3: Deploy Frontend to Render

### 3.1 Create Frontend Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your **"CGPA-Calculator"** repository
3. Configure the site:

   **Basic Settings:**
   - **Name:** `cgpa-calculator-frontend`
   - **Branch:** `main`
   - **Root Directory:** `cgpa-calculator`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

### 3.2 Add Environment Variables

Add this environment variable:

| Key                 | Value                                                                                |
|---------------------|--------------------------------------------------------------------------------------|
| `REACT_APP_API_URL` | `https://cgpa-calculator-backend.onrender.com` (your backend URL from Step 2.3)     |

### 3.3 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll get your frontend URL:

   ```text
   https://cgpa-calculator-frontend.onrender.com
   ```

---

## Step 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to your backend service in Render
2. Click **"Environment"** in the left sidebar
3. Find `FRONTEND_URL` and set it to your frontend URL:

   ```text
   https://cgpa-calculator-frontend.onrender.com
   ```

4. Click **"Save Changes"**
5. Backend will automatically redeploy

---

## Step 5: Test Your Application

1. Visit your frontend URL: `https://cgpa-calculator-frontend.onrender.com`
2. Try to sign up with a new account
3. Check your email for verification
4. Log in and calculate CGPA
5. Check if records are saved

---

## 🎉 You're Live!

Your CGPA Calculator is now deployed and accessible worldwide!

**Your URLs:**
- **Frontend:** https://cgpa-calculator-frontend.onrender.com
- **Backend API:** https://cgpa-calculator-backend.onrender.com
- **Database:** MongoDB Atlas

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds (cold start)
- 750 hours/month per service (sufficient for one service)

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared RAM
- Perfect for development/small projects

### Automatic Deployments

Every time you push to your `main` branch on GitHub:
- Render will automatically rebuild and redeploy your app
- No manual intervention needed!

### Custom Domain (Optional)

To use your own domain:
1. In Render, go to your frontend service
2. Click **"Settings"** → **"Custom Domains"**
3. Follow instructions to add your domain

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` is set correctly
- Verify backend CORS includes your frontend URL
- Check backend logs for CORS errors

### Email verification not working
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASSWORD in backend env vars
- Less secure apps must be disabled (use App Password instead)

### Cold starts are slow
- This is normal for free tier
- First request after 15 min takes 30-60s
- Consider upgrading to paid tier for instant responses

---

## 🔄 Making Updates

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. Render automatically deploys! ✨

---

## 📊 Monitoring

**Render Dashboard:**
- View logs
- Monitor performance
- Check build/deploy status

**MongoDB Atlas:**
- Monitor database usage
- View connection metrics
- Set up alerts

---

## 💰 Upgrading (Optional)

If you need better performance:

**Render Starter Plan** ($7/month per service):
- No cold starts
- Better performance
- More build minutes

**MongoDB Paid Tiers:**
- More storage
- Better performance
- Automated backups

---

## 🔐 Security Best Practices

✅ Never commit `.env` files to GitHub

✅ Use strong JWT secrets (32+ characters)

✅ Use Gmail App Passwords (not your main password)

✅ Regularly rotate secrets

✅ Monitor access logs in MongoDB Atlas

✅ Keep dependencies updated

---

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created

- [ ] Database user created with password

- [ ] Network access configured (0.0.0.0/0)

- [ ] Connection string copied and updated

- [ ] Backend deployed to Render

- [ ] Backend environment variables set

- [ ] Backend health check passes

- [ ] Frontend deployed to Render

- [ ] Frontend environment variable set

- [ ] Backend CORS updated with frontend URL

- [ ] Tested signup/login

- [ ] Tested email verification

- [ ] Tested CGPA calculation

- [ ] Tested data persistence

---

**Need Help?** Check the troubleshooting section or Render's support documentation.

**Congratulations!** Your CGPA Calculator is now live on the internet! 🎓📊
