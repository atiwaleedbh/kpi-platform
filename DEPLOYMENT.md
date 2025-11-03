# KPI Platform Deployment Guide

Complete guide to deploy the KPI Platform to Vercel with Supabase database.

## Prerequisites

- GitHub/GitLab account
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Node.js v16+ installed locally

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: kpi-platform (or your preferred name)
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose closest to your target users
   - **Pricing Plan**: Free tier is sufficient to start
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### 1.2 Run Database Schema

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `supabase/schema.sql` from this repository
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" or press `Ctrl+Enter`
7. You should see "Success. No rows returned"

### 1.3 Verify Database Setup

1. Go to **Table Editor** (left sidebar)
2. Verify these tables exist:
   - `categories` (should have 4 default rows)
   - `kpis`
   - `metrics`
3. Click on `categories` to see the pre-populated data

### 1.4 Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy the following values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (⚠️ Keep this secret!)

## Step 2: Prepare Repository

### 2.1 Clone Repository

```bash
git clone <your-repository-url>
cd kpi-platform
```

### 2.2 Test Locally (Optional but Recommended)

```bash
# Install dependencies
npm install
cd client
npm install
cd ..

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env  # or use your preferred editor
```

Add your Supabase credentials to `.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=development
```

```bash
# Install Vercel CLI
npm install -g vercel

# Run development server
vercel dev

# Open http://localhost:3000
```

If everything works locally, proceed to deployment.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

#### 3.1 Import Project

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click "Add New..." → "Project"
4. Import your Git repository:
   - If not connected, authorize Vercel to access your Git provider
   - Select the `kpi-platform` repository
5. Click "Import"

#### 3.2 Configure Project

Vercel will auto-detect some settings. Configure:

**Framework Preset**: Other

**Root Directory**: `./` (leave as default)

**Build Settings**:
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install`

#### 3.3 Add Environment Variables

Before deploying, add environment variables:

1. Click "Environment Variables" section
2. Add each variable:

| Name | Value | Environments |
|------|-------|--------------|
| `SUPABASE_URL` | Your Project URL from Supabase | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production, Preview, Development |

⚠️ **Important**: The service role key grants full database access. Only add it to server-side environment variables.

#### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-5 minutes for deployment
3. Once complete, you'll see "Congratulations!" 🎉
4. Click "Visit" to see your live site

Your app is now live at: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? kpi-platform (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? No

# Add environment variables
vercel env add SUPABASE_URL production
# Paste your Supabase URL

vercel env add SUPABASE_ANON_KEY production
# Paste your anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste your service role key

# Deploy to production
vercel --prod
```

## Step 4: Verify Deployment

### 4.1 Test API Endpoints

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Should return: {"status":"OK","message":"KPI Platform is running"}

# Get categories
curl https://your-project.vercel.app/api/categories

# Should return: {"success":true,"count":4,"data":[...]}
```

### 4.2 Test Frontend

1. Visit `https://your-project.vercel.app`
2. You should see the dashboard
3. Navigate to "Categories" - you should see 4 default categories
4. Try creating a KPI

### 4.3 Check Logs

If something doesn't work:

1. Go to your Vercel project dashboard
2. Click "Logs" or "Functions"
3. Check for any error messages

Common issues:
- **500 errors**: Check environment variables are set correctly
- **Database errors**: Verify Supabase credentials
- **CORS errors**: Check Vercel configuration

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. In your Vercel project, go to "Settings" → "Domains"
2. Click "Add"
3. Enter your domain (e.g., `kpi.yourdomain.com`)
4. Follow the DNS configuration instructions

### 5.2 Update DNS

Add the records shown by Vercel to your DNS provider.

**For subdomain** (e.g., kpi.yourdomain.com):
```
Type: CNAME
Name: kpi
Value: cname.vercel-dns.com
```

**For root domain** (e.g., yourdomain.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

### 5.3 Wait for Propagation

- DNS changes can take 24-48 hours
- Vercel will automatically provision SSL certificate
- Once verified, your app is accessible at your custom domain

## Step 6: Set Up Continuous Deployment

Vercel automatically deploys on every push to your main branch.

### 6.1 Configure Branch Deployments

1. In Vercel project settings → "Git"
2. Configure:
   - **Production Branch**: `main` or `master`
   - **Preview Deployments**: All branches
3. Every commit to main = automatic production deploy
4. Every PR = automatic preview deployment

### 6.2 Deploy Hooks (Optional)

For manual triggers:

1. Go to "Settings" → "Git"
2. Click "Deploy Hooks"
3. Create a hook for production
4. Use the webhook URL to trigger deploys via API

## Step 7: Monitoring and Maintenance

### 7.1 Vercel Monitoring

Monitor your deployment:
- **Analytics**: View page views and performance
- **Speed Insights**: Track web vitals
- **Logs**: View function execution logs
- **Usage**: Monitor bandwidth and function executions

### 7.2 Supabase Monitoring

Monitor your database:
- **Database Health**: Check connection pool and queries
- **Logs**: View query logs
- **Performance**: Identify slow queries
- **API Usage**: Track API requests

### 7.3 Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups, 7 days retention
- **Pro tier**: Daily backups, 30 days retention + PITR

To manually backup:
```sql
-- In Supabase SQL Editor
-- Export data from each table
```

Or use Supabase CLI:
```bash
supabase db dump
```

## Troubleshooting

### Issue: API returns 500 errors

**Solution**:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test Supabase connection in SQL Editor
4. Ensure database schema was applied correctly

### Issue: Frontend shows blank page

**Solution**:
1. Check browser console for errors
2. Verify build completed successfully in Vercel
3. Check that `client/build` directory was created
4. Verify routing in `vercel.json`

### Issue: CORS errors

**Solution**:
- Already configured in `vercel.json`
- If custom domain, may need to update CORS settings
- Check browser console for exact error

### Issue: Database connection timeout

**Solution**:
1. Verify Supabase project is not paused (free tier pauses after inactivity)
2. Check Supabase project status in dashboard
3. Verify API keys are correct
4. Check Supabase service status: [status.supabase.com](https://status.supabase.com)

### Issue: Out of function execution quota

**Solution**:
- Free tier: 100GB-hrs/month
- Optimize API calls to reduce function executions
- Consider upgrading to Pro tier
- Add caching for frequently accessed data

## Performance Optimization

### Database Optimization

1. **Indexes** (already created in schema):
   - `idx_kpis_category_id`
   - `idx_kpis_status`
   - `idx_metrics_kpi_id`
   - `idx_metrics_timestamp`

2. **Query Optimization**:
   - Use `.limit()` on large result sets
   - Add `.select()` to only fetch needed columns
   - Use indexes for WHERE clauses

### Frontend Optimization

1. **Code Splitting**: Already using React lazy loading
2. **Image Optimization**: Use Vercel Image component
3. **Caching**: Implement React Query or SWR
4. **Bundle Size**: Monitor and optimize imports

### API Optimization

1. **Cold Starts**: Minimize dependencies in functions
2. **Response Time**: Keep functions under 1 second
3. **Caching**: Add cache headers for static data
4. **Rate Limiting**: Implement in production

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Service role key not exposed to frontend
- [ ] Supabase RLS policies configured (for production)
- [ ] Authentication implemented (for production)
- [ ] Rate limiting enabled (for production)
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Regular dependency updates
- [ ] Database backups verified

## Scaling Considerations

### When to Upgrade

**Vercel**:
- Free: Good for development and small apps
- Pro ($20/month): Better performance, more functions
- Enterprise: Custom limits and support

**Supabase**:
- Free: 500MB database, 1GB bandwidth/day
- Pro ($25/month): 8GB database, 100GB bandwidth/day
- Team/Enterprise: Custom resources

### Scaling Checklist

- [ ] Monitor function execution time
- [ ] Track database size and queries
- [ ] Set up alerting for errors
- [ ] Implement caching strategy
- [ ] Consider CDN for static assets
- [ ] Database connection pooling (already included)

## Next Steps

1. **Add Authentication**: Integrate Supabase Auth
2. **Enable RLS**: Configure Row Level Security policies
3. **Add Tests**: Write unit and integration tests
4. **CI/CD**: Set up GitHub Actions
5. **Monitoring**: Add error tracking (Sentry)
6. **Analytics**: Track user behavior
7. **Documentation**: Add API documentation site

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community Support**: GitHub Discussions
- **Status Pages**:
  - [Vercel Status](https://www.vercel-status.com/)
  - [Supabase Status](https://status.supabase.com/)

## Success! 🎉

Your KPI Platform is now:
- ✅ Deployed to Vercel
- ✅ Connected to Supabase
- ✅ Accessible worldwide
- ✅ Automatically deploying on code changes
- ✅ Scalable and secure

Start adding KPIs and tracking your metrics!
