# 🚀 Complete Setup Guide for Beginners

## What You'll Build

A professional KPI Management Platform where:
- Operators enter production data (like OEE, quality metrics)
- Managers view department performance and drill down into details
- KPIs automatically calculate and roll up from teams → departments → plant
- Dashboards show real-time color-coded performance
- Everything is secure with role-based access

## Prerequisites (Things You Need First)

### 1. Install Node.js
**What is it?** JavaScript runtime that lets you run the application.

**Installation:**
- Go to: https://nodejs.org/
- Download the LTS version (v18 or higher)
- Run the installer
- Verify: Open terminal/command prompt and type:
  ```bash
  node --version
  # Should show: v18.x.x or higher

  npm --version
  # Should show: 9.x.x or higher
  ```

### 2. Install Git
**What is it?** Version control system to track code changes.

**Installation:**
- Windows: https://git-scm.com/download/win
- Mac: `brew install git` or download from git-scm.com
- Linux: `sudo apt-get install git`
- Verify:
  ```bash
  git --version
  # Should show: git version 2.x.x
  ```

### 3. Install VS Code (Recommended)
**What is it?** Code editor that makes development easier.

**Installation:**
- Go to: https://code.visualstudio.com/
- Download and install
- Install these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

### 4. Create GitHub Account
**What is it?** Where your code will be stored.

- Go to: https://github.com/
- Sign up for free account
- Remember your username and password

### 5. Create Supabase Account
**What is it?** Your database and authentication system.

- Go to: https://supabase.com/
- Sign up with GitHub (easiest)
- Free tier is perfect for starting

### 6. Create Vercel Account
**What is it?** Where your application will be hosted (live on internet).

- Go to: https://vercel.com/
- Sign up with GitHub (easiest)
- Free tier is perfect for starting

## 📋 Step-by-Step Setup

### Step 1: Set Up Supabase Project

#### 1.1 Create New Project
1. Log into Supabase dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: "kpi-platform" (or your choice)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
4. Click "Create Project" (takes 2-3 minutes)

#### 1.2 Get API Keys
1. In Supabase dashboard, go to **Settings** (gear icon)
2. Click **API**
3. You'll see:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with "eyJ...")
   - **service_role** key (another long string)
4. **SAVE THESE!** You'll need them soon

#### 1.3 Create Database Tables
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. You'll paste SQL code here (we'll provide this next)

**Wait!** We'll come back to this after setting up Next.js project.

### Step 2: Set Up Next.js Project Locally

#### 2.1 Open Terminal
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "terminal", press Enter
- **Linux**: Press `Ctrl + Alt + T`

#### 2.2 Navigate to Your Project
```bash
# Go to your project folder
cd /path/to/kpi-platform

# Or if starting fresh:
cd ~  # Go to home directory
mkdir projects  # Create projects folder
cd projects
git clone https://github.com/YOUR_USERNAME/kpi-platform.git
cd kpi-platform
```

#### 2.3 Clean Up Old Files
Since we're starting fresh with Next.js:
```bash
# We'll keep .git folder but remove old code
# DON'T WORRY - we'll rebuild everything better!
```

### Step 3: Initialize Next.js Project

#### 3.1 Create Next.js App
```bash
# This command creates a new Next.js 14 project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**What this does:**
- `npx create-next-app@latest` - Creates latest Next.js app
- `.` - In current directory
- `--typescript` - Adds TypeScript (type safety)
- `--tailwind` - Adds Tailwind CSS (styling)
- `--app` - Uses App Router (modern Next.js)
- `--no-src-dir` - Cleaner structure
- `--import-alias "@/*"` - Easy imports

**You'll be asked:**
- Would you like to use ESLint? → **Yes**
- Would you like to use Turbopack? → **No** (not stable yet)

#### 3.2 Install Required Packages
```bash
# Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install UI components (shadcn/ui)
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-label

# Install form handling
npm install react-hook-form @hookform/resolvers zod

# Install charts
npm install recharts

# Install date handling
npm install date-fns

# Install utilities
npm install zustand  # State management
npm install react-query  # Data fetching
```

**What each does:**
- `@supabase/*` - Connect to your database
- `@radix-ui/*` - Accessible UI components
- `react-hook-form` + `zod` - Forms with validation
- `recharts` - Beautiful charts for KPIs
- `date-fns` - Date formatting
- `zustand` - Simple state management
- `react-query` - Smart data fetching

### Step 4: Configure Environment Variables

#### 4.1 Create .env.local File
```bash
# In your project root, create this file:
touch .env.local
```

#### 4.2 Add Your Supabase Keys
Open `.env.local` in VS Code and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Replace with your actual keys from Step 1.2!**

**IMPORTANT:**
- Never commit `.env.local` to git (already in .gitignore)
- `NEXT_PUBLIC_*` variables are safe for browser
- `SUPABASE_SERVICE_ROLE_KEY` is secret (server-only)

### Step 5: Set Up Database Schema

#### 5.1 Run Database Migration
We'll create a SQL file that builds all your tables:

1. Go to Supabase dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Paste the SQL code (we'll provide in next step)
5. Click **Run**

**What this creates:**
- All tables (users, departments, KPIs, entries, dashboards)
- Relationships between tables
- Security policies (who can see what)
- Indexes for speed

### Step 6: Test the Setup

#### 6.1 Start Development Server
```bash
npm run dev
```

**Expected output:**
```
> kpi-platform@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

#### 6.2 Open in Browser
1. Open browser
2. Go to: http://localhost:3000
3. You should see Next.js default page

**If you see errors:**
- Check Node.js version: `node --version` (should be 18+)
- Check `.env.local` file exists with correct keys
- Check Supabase project is running
- Try: `npm install` again

### Step 7: Understanding the Project Structure

After setup, your project looks like:

```
kpi-platform/
├── app/                    # Next.js App Router (pages go here)
│   ├── layout.tsx         # Root layout (navigation, etc.)
│   ├── page.tsx           # Home page
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── kpis/              # KPI management pages
│   └── api/               # API routes (backend)
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase client setup
│   ├── utils.ts          # Helper functions
│   └── validations/      # Form validation schemas
├── types/                 # TypeScript type definitions
│   └── database.ts       # Database types
├── public/               # Static files (images, etc.)
├── .env.local           # Environment variables (SECRET!)
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

### Step 8: Version Control (Git)

#### 8.1 Commit Your Setup
```bash
# Check what's changed
git status

# Add all files
git add .

# Create a commit
git commit -m "Initial Next.js setup with Supabase integration"

# Push to GitHub
git push origin claude/kpi-platform-architecture-011CUpncfR9Xuyhpw5C3u7hn
```

### Step 9: Deploy to Vercel (Optional - Do This Later)

#### 9.1 Connect GitHub to Vercel
1. Log into Vercel dashboard
2. Click **New Project**
3. **Import Git Repository**
4. Select your `kpi-platform` repository
5. Vercel auto-detects Next.js ✅

#### 9.2 Add Environment Variables
1. In Vercel project settings
2. Go to **Environment Variables**
3. Add each variable from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**

#### 9.3 Your App is Live!
- Vercel gives you a URL: `https://kpi-platform-xxxxx.vercel.app`
- Every git push auto-deploys
- Preview deployments for each PR

## 🎓 Learning Resources

### Next.js
- Official Docs: https://nextjs.org/docs
- Learn Course: https://nextjs.org/learn
- YouTube: "Next.js 14 Tutorial" by Net Ninja

### Supabase
- Official Docs: https://supabase.com/docs
- Video Course: https://supabase.com/docs/guides/getting-started
- YouTube: "Supabase Tutorial" by Fireship

### TypeScript
- Official Handbook: https://www.typescriptlang.org/docs/handbook/
- Interactive Tutorial: https://www.typescriptlang.org/play

### Tailwind CSS
- Official Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

## 🐛 Troubleshooting

### Problem: "Command not found: npm"
**Solution:** Node.js not installed correctly
- Reinstall Node.js from nodejs.org
- Restart terminal after installation

### Problem: "Module not found" errors
**Solution:** Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Supabase connection fails
**Solution:** Check environment variables
- Ensure `.env.local` exists
- Check no extra spaces in keys
- Verify keys are from correct Supabase project
- Restart dev server: `Ctrl+C`, then `npm run dev`

### Problem: Port 3000 already in use
**Solution:** Another app is using the port
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Problem: Git push rejected
**Solution:** Branch issues
```bash
# Ensure you're on correct branch
git branch

# If not, switch to it
git checkout claude/kpi-platform-architecture-011CUpncfR9Xuyhpw5C3u7hn
```

## 📞 Getting Help

### If You're Stuck:
1. **Read the error message** - It usually tells you what's wrong
2. **Check the console** - Browser console shows client errors
3. **Check terminal** - Server errors show here
4. **Google the error** - Often others had same issue
5. **Ask in communities**:
   - Next.js Discord: https://nextjs.org/discord
   - Supabase Discord: https://discord.supabase.com/
   - Stack Overflow: Tag [next.js] [supabase]

## ✅ Setup Complete Checklist

- [ ] Node.js installed (v18+)
- [ ] Git installed
- [ ] VS Code installed with extensions
- [ ] GitHub account created
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Vercel account created
- [ ] Next.js project initialized
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Development server runs (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Code committed to git

## 🎯 Next Steps

After setup is complete:
1. ✅ We'll create the database schema
2. ✅ Build authentication system
3. ✅ Create user roles
4. ✅ Build the admin interface
5. ✅ Build data entry interface
6. ✅ Create dashboards
7. ✅ Implement calculation engine
8. ✅ Deploy to production

**You're ready to build an amazing KPI platform!** 🚀
