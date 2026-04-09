# Deploy to Vercel

## Prerequisites
1. MongoDB Atlas account (free tier available)
2. Vercel account
3. Git repository with this project

## Steps to Deploy

### 1. Set up MongoDB Atlas
- Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- Create a cluster (free tier is fine)
- Create a database user and get your connection string
- Copy the connection string like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### 3. Connect to Vercel
- Go to https://vercel.com/new
- Import your GitHub repository
- Select "Next.js" or "Other" - Vercel will auto-detect

### 4. Set Environment Variables
On Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string for JWT signing |
| `ADMIN_USERNAME` | `admin` (or your preferred username) |
| `ADMIN_PASSWORD` | Your secure password |
| `NODE_ENV` | `production` |

### 5. Deploy
- Click "Deploy" on Vercel
- Wait for deployment to complete
- Visit your deployed site!

## Access Your App
- **Portfolio**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/login`
- **Default Credentials**: 
  - Username: `admin` (or what you set in env vars)
  - Password: as set in env vars

## Troubleshooting

### API calls failing
- Check that `MONGODB_URI` is correct in Vercel env vars
- Ensure MongoDB Atlas allows connections from Vercel's IP (set to 0.0.0.0/0 in Network Access)

### Resume upload not working
- Vercel serverless functions have a 10-second timeout for free tier
- Upload directory is ephemeral; files are deleted after function execution
- For production: Use cloud storage like AWS S3, Cloudinary, or Bunny CDN

### Admin login not working
- Check `JWT_SECRET` env var is set
- Make sure MongoDB is accessible

## For Production Use

For a production application with persistent file uploads, consider:
1. **AWS S3** for resume storage
2. **Cloudinary** for image hosting
3. **MongoDB Realm** for serverless database
4. Upgrade to Vercel Pro for better performance

## Local Development

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`
