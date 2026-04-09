# Vercel Deployment Checklist

## ✅ Pre-Deployment

- [ ] MongoDB Atlas account created and cluster set up
- [ ] MongoDB connection string copied from Atlas
- [ ] GitHub account created (or use existing)
- [ ] Vercel account created (free tier available)
- [ ] Project code pushed to GitHub

## 🚀 Deploy Steps

### Step 1: Create GitHub Repository
```bash
cd /path/to/VivekPortfolio
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project (Vercel auto-detects it)
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random string (e.g., using openssl: `openssl rand -hex 32`)
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Your secure password
   - `NODE_ENV`: `production`
6. Click "Deploy"

### Step 3: Configure MongoDB (Important!)
1. Go to MongoDB Atlas
2. Go to Network Access → IP Allowlist
3. Add IP Address `0.0.0.0/0` (allows all IPs - for Vercel)
4. Alternatively, use: `Tools → IP Access Whitelist` and add the Vercel IPs

### Step 4: Test Your Deployment
- Visit `https://your-project.vercel.app`
- Go to `/login` and enter admin credentials
- Try uploading data in admin panel

## 📝 Production Considerations

### File Uploads (Important)
- Vercel serverless functions have a 10-second timeout
- Uploaded files are **NOT** persistent (deleted after function execution)
- **Solution for production**: Use cloud storage:
  - **Cloudinary** (free tier, images)
  - **AWS S3** (paid, reliable)
  - **Bunny CDN** (affordable)

### Current Limitations
- Resume uploads work but files won't persist after 24 hours
- For persistent storage, upgrade to paid tier or use external storage

### Recommended Setup
```
Frontend: Vercel (free)
Backend API: Vercel (free or Pro)
Database: MongoDB Atlas (free tier)
File Storage: Cloudinary (free tier) or AWS S3
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 401 | Check `JWT_SECRET` env var is set |
| MongoDB connection fails | Add `0.0.0.0/0` to MongoDB Atlas IP whitelist |
| Resume upload fails | Check file is PDF, size < 50MB |
| Admin can't log in | Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` match env vars |
| Site shows "Not Found" | Clear browser cache, check Vercel deployment logs |

## 📊 Monitor Your App

1. **Vercel Dashboard**: Check deployment logs
2. **Vercel Analytics**: View traffic and performance
3. **MongoDB Atlas**: Check database metrics
4. **Email notifications**: Enable Vercel alerts

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/
- Check Vercel deployment logs for errors
