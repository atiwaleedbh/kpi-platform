# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Supabase Configuration
- [ ] Supabase project created
- [ ] Database schema deployed (`supabase-schema.sql`)
- [ ] First admin user created in Supabase Auth
- [ ] User profile added to `user_profiles` table with `super_admin` role
- [ ] Copy Supabase URL and API keys

### 2. Vercel Project Setup
- [ ] GitHub repository connected to Vercel
- [ ] Project imported in Vercel
- [ ] Environment variables added (see below)

### 3. Environment Variables (Vercel Dashboard)

Add these in **Settings → Environment Variables**:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Apply to:** Production, Preview, Development

### 4. Supabase Authentication Settings

In Supabase Dashboard → **Authentication → URL Configuration**:

- [ ] **Site URL**: `https://your-app.vercel.app`
- [ ] **Redirect URLs**: 
  - `https://your-app.vercel.app/**`
  - `http://localhost:3000/**`

### 5. Deploy
- [ ] Push to main branch or trigger manual deployment
- [ ] Wait for build to complete
- [ ] Check build logs for any errors

### 6. Post-Deployment Testing
- [ ] Visit deployed URL
- [ ] Verify login page loads with correct styling
- [ ] Test login with created user
- [ ] Verify redirect to dashboard works
- [ ] Check dashboard displays correctly
- [ ] Test logout (if implemented)
- [ ] Check browser console for errors (should be none)

## 🔍 Troubleshooting

### Build fails
- Check all environment variables are set
- Review build logs in Vercel dashboard
- Ensure dependencies are up to date

### Login doesn't work
- Verify Supabase URL configuration (Site URL and Redirect URLs)
- Check user exists in Supabase Auth
- Check user has profile in `user_profiles` table
- Verify environment variables are correct

### CSS not loading
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Check Network tab in browser DevTools

### Redirects to login after successful login
- Verify Supabase URL configuration is correct
- Check browser cookies are enabled
- Verify session is being created (check Supabase dashboard → Authentication → Users → Sessions)

## 📝 Quick Reference

### Supabase Dashboard Locations
- **API Settings**: Settings → API
- **Auth Settings**: Authentication → URL Configuration
- **Users**: Authentication → Users
- **Database**: Database → Table Editor

### Vercel Dashboard Locations
- **Environment Variables**: Settings → Environment Variables
- **Deployments**: Deployments tab
- **Build Logs**: Click on deployment → View Build Logs
- **Function Logs**: Click on deployment → View Function Logs

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Login page has proper styling
- ✅ No console errors in browser
- ✅ Login works and redirects to dashboard
- ✅ Session persists on page refresh
- ✅ Dashboard displays user information

## 📞 Support

If you encounter issues:
1. Check VERCEL_DEPLOYMENT_GUIDE.md for detailed solutions
2. Review Vercel build logs
3. Check Supabase authentication logs
4. Verify all configuration steps above
