# 🚀 RENDER DEPLOYMENT GUIDE

## ✅ Pre-Deployment Checklist

- [x] Express backend configured in `server.ts`
- [x] MongoDB integration ready
- [x] JWT authentication set up
- [x] File upload with multer configured
- [x] TypeScript configured
- [x] .env.example created
- [x] Project on GitHub
- [x] render.yaml created

---

## 📝 STEP 1: Prepare Your Repository

### 1.1 Commit all changes to GitHub:
```bash
cd "C:\Users\Vivek\B.Tech\IV- SEM\Advance Web Technology (AWT)\Unit 3\VivekPortfolioOffline"
git add .
git commit -m "Update server.ts for Render production deployment and add render.yaml"
git push origin main
```

### 1.2 Verify files are committed:
- [x] server.ts (updated for production)
- [x] package.json (with start:prod script)
- [x] render.yaml (Render configuration)
- [x] .env.example (for reference)
- [x] tsconfig.json
- [x] vite.config.ts

---

## 🔐 STEP 2: Set Up MongoDB Connection

### 2.1 Use MongoDB Atlas (Cloud MongoDB)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if not already done)
3. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2.2 Update Connection String
Replace `<username>` and `<password>` in your connection string with your actual MongoDB credentials.

---

## 🌐 STEP 3: Create Render Web Service

### 3.1 Go to Render Dashboard
1. Visit [render.com](https://render.com)
2. Sign in with GitHub
3. Dashboard → **New +** → **Web Service**

### 3.2 Configure the Service

#### Repository Selection:
- Repository: `VivekPortfolioOffline`
- Branch: `main`
- Auto-deploy: ✓ (recommended)

#### Build & Start Commands:
| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Runtime** | Node |
| **Region** | Singapore (recommended for India) |
| **Plan** | Free (0-$15/month) |

---

## 🔧 STEP 4: Set Environment Variables in Render

In Render Dashboard → Your Service → **Environment** tab, add these variables:

```
NODE_ENV=production

MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_use_strong_random_value_here

ADMIN_USERNAME=admin

ADMIN_PASSWORD=your_secure_admin_password

GEMINI_API_KEY=your_gemini_api_key_from_google

APP_URL=https://vivek-portfolio-backend.onrender.com
```

### ⚠️ Important Security Notes:
- **Never use simple passwords** - Use strong, random values
- **Use environment variables** - Don't hardcode secrets
- Generate a strong JWT_SECRET: Use online JWT secret generators or: `openssl rand -base64 32`
- Keep these values in Render only, not in GitHub

---

## 🎯 STEP 5: Complete the Deployment

1. **Scroll to bottom** of Render form
2. Click **Create Web Service**
3. Render will automatically:
   - Build your project (`npm install && npm run build`)
   - Install dependencies
   - Build the Vite frontend (creates `/dist`)
   - Start your server (`npm run start:prod`)

### Deployment takes 2-5 minutes ⏳

---

## ✨ STEP 6: Verify Deployment

### 6.1 Check Deployment Status
- Watch the **Deploy Log** in Render dashboard
- Look for: `Server running on http://localhost:PORT`

### 6.2 Test Your Backend

Once deployment is successful, you'll get a URL like:
```
https://vivek-portfolio-backend.onrender.com
```

Test these endpoints:

1. **Frontend (should load):**
   ```
   GET https://vivek-portfolio-backend.onrender.com/
   ```

2. **Get Skills:**
   ```
   GET https://vivek-portfolio-backend.onrender.com/api/skills
   ```

3. **Get Site Settings:**
   ```
   GET https://vivek-portfolio-backend.onrender.com/api/site-settings
   ```

4. **Login (get JWT token):**
   ```bash
   POST https://vivek-portfolio-backend.onrender.com/api/login
   Content-Type: application/json

   {
     "username": "admin",
     "password": "your_admin_password"
   }
   ```

---

## 🔗 STEP 7: Update Your Vercel Frontend

Update your Vercel frontend to use your Render backend:

### 7.1 In your frontend (axios/fetch calls):
```typescript
const API_URL = "https://vivek-portfolio-backend.onrender.com/api";
// Or in environment variables
process.env.VITE_API_URL
```

### 7.2 Update environment variables in Vercel:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://vivek-portfolio-backend.onrender.com/api
   ```

---

## 📊 What's Deployed

### Frontend (From Vercel):
- ✓ React UI
- ✓ Dashboard
- ✓ Portfolio pages

### Backend (From Render):
- ✓ Express Server
- ✓ MongoDB Integration
- ✓ Skills API
- ✓ Projects API
- ✓ Experience API
- ✓ Education API
- ✓ Site Settings API
- ✓ Admin Authentication
- ✓ File Upload (resume)

---

## 🚨 IMPORTANT: File Upload Limitation

⚠️ **Render Free Plan:**
- Upload directory (`/uploads`) is **ephemeral**
- Files are deleted after service restarts
- Restarts happen randomly or daily on free tier

### Solution (Optional):
For production file storage, consider:
1. **AWS S3** (free tier available)
2. **Google Cloud Storage**
3. **Cloudinary** (for images)
4. **Upgrading Render plan** (paid plans have persistent storage)

---

## 🔄 Deployment Workflow Going Forward

### When you make changes:

1. **Make changes locally:**
   ```bash
   # Make your code changes
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. **Render auto-deploys** (if auto-deploy enabled)
3. **Check deploy log** in Render dashboard
4. **Test your endpoints**

---

## 🐛 Troubleshooting

### "Build failed"
1. Check Build Log in Render
2. Verify `npm run build` works locally: `npm run build`
3. Check package.json scripts

### "Cannot connect to MongoDB"
1. Check MONGODB_URI format
2. Verify MongoDB Atlas allows connections from Render IPs
3. In MongoDB Atlas → Network Access → Allow from anywhere (0.0.0.0/0)
4. Check username/password in connection string

### "Cannot find module 'express'"
1. Check node_modules locally: `npm install`
2. All dependencies listed in package.json

### "Server won't start"
1. Check environment variables in Render
2. View Deploy Log for errors
3. Test locally: `npm run start:prod`

### "Uploads not persisting"
- Expected on free tier (see File Upload Limitation above)
- Use cloud storage instead

---

## 📞 Support Links

- **Render Docs:** https://render.com/docs
- **Express Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com
- **Vite Docs:** https://vitejs.dev

---

## ✅ Final Checklist

- [ ] GitHub repository has latest code
- [ ] MongoDB Atlas cluster created and running
- [ ] Render account created and connected to GitHub
- [ ] Web Service created on Render
- [ ] All environment variables added to Render
- [ ] Deployment completed successfully
- [ ] Backend endpoints tested and working
- [ ] Vercel frontend updated with backend URL
- [ ] CORS configured correctly
- [ ] JWT secret is strong and random

---

**🎉 You're all set! Your backend is now live on Render.**

For questions: Check Render deploy logs or review this guide.
