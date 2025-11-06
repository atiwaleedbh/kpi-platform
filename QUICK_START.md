# ⚡ Quick Start - Codespaces & Vercel

> **5-minute cheat sheet for working without a laptop**

---

## 🎯 Three Simple Steps

### 1️⃣ Open Codespace (2 minutes)

```
GitHub.com → Your Repo → Code button → Codespaces → Create
↓
Wait for VS Code to load in browser
↓
Terminal: npm install
```

### 2️⃣ Configure & Test (5 minutes)

**Create `.env.local`:**
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
```

**Create user profile in Supabase SQL Editor:**
```sql
INSERT INTO user_profiles (id, email, full_name, role, organization_id, is_active)
VALUES ('YOUR_USER_UUID', 'you@email.com', 'Your Name', 'super_admin',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true);
```

**Run:**
```bash
npm run dev
```

### 3️⃣ Deploy to Vercel (3 minutes)

```
1. Vercel.com → Sign in with GitHub
2. Import kpi-platform repo
3. Add same environment variables
4. Change NEXT_PUBLIC_APP_URL to your Vercel URL
5. Deploy!
```

---

## 📋 Essential Links

| What | Where |
|------|-------|
| **Open Codespace** | github.com/codespaces |
| **Supabase Dashboard** | app.supabase.com |
| **Vercel Dashboard** | vercel.com/dashboard |
| **Full Guide** | See `CODESPACES_VERCEL_GUIDE.md` |

---

## 🔑 Get Supabase Credentials

```
Supabase Dashboard → Settings → API

Copy these 3 values:
✓ Project URL
✓ anon public key
✓ service_role key
```

---

## 🚀 Common Commands

```bash
# Start dev server
npm run dev

# Stop server
Ctrl+C

# Build for production
npm run build

# Deploy (automatic on git push)
git add .
git commit -m "description"
git push
```

---

## ✅ Checklist

**Before deploying:**
- [ ] Database schema deployed in Supabase
- [ ] User created in Supabase Auth
- [ ] User profile created with super_admin role
- [ ] `.env.local` configured with real credentials
- [ ] `npm run dev` works in Codespace
- [ ] Can sign in successfully

**In Vercel:**
- [ ] All 5 environment variables added
- [ ] Build completes successfully
- [ ] Vercel URL added to Supabase allowed domains
- [ ] Can sign in to live app

---

## 🆘 Quick Fixes

**Port in use:**
```bash
npx kill-port 3000
npm run dev
```

**Can't sign in:**
- Check Supabase → Settings → API → URL Configuration
- Add Vercel URL to allowed domains

**Build fails:**
- Verify all env variables are set
- Try `npm run build` in Codespace first

---

## 💡 Pro Tips

✨ **Codespace sleeps after 30 min** - just click it again to wake up

✨ **Auto-deploy on push** - Vercel rebuilds when you push to GitHub

✨ **Works on tablets** - Use external keyboard for best experience

✨ **Free tiers** - Codespace (60 hrs/month), Vercel (unlimited), Supabase (500 MB)

---

**Need detailed steps?** → See `CODESPACES_VERCEL_GUIDE.md`

**Questions about architecture?** → See `ARCHITECTURE.md`

**Setting up for first time?** → See `SETUP_GUIDE.md`

---

🎉 **You got this!**
