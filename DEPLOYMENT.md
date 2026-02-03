# Deployment Guide - Expense Tracker

## Deploying to Vercel

### Prerequisites
- A Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Navigate to project directory**:
```bash
cd expense-tracker
```

4. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- Project name? **expense-tracker** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **No**

5. **Production deployment**:
```bash
vercel --prod
```

### Method 2: Deploy via GitHub Integration

1. **Push code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Automatic deployments**:
   - Every push to `main` branch = production deployment
   - Every push to other branches = preview deployment

### Post-Deployment

1. **Access your app**: Vercel will provide a URL like `https://expense-tracker.vercel.app`

2. **Environment Variables** (if needed in future):
   - Go to Project Settings → Environment Variables
   - Add any required variables

3. **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain

### Important Notes

⚠️ **Data Persistence**: 
- The current implementation uses in-memory storage on Vercel
- Data will reset on serverless function cold starts
- For production with persistent data, integrate:
  - **Vercel KV** (recommended for Vercel)
  - **Vercel Postgres**
  - **MongoDB Atlas**
  - **Supabase**

### Troubleshooting

**Build fails:**
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

**API routes not working:**
- Ensure files are in `pages/api/` directory
- Check Vercel function logs
- Verify CORS headers if needed

**Data not persisting:**
- This is expected with in-memory storage
- Consider migrating to a database (see README)

### Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test production build locally
npm run build
npm start
```

Visit `http://localhost:3000` to test locally.

