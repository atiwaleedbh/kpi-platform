# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project Name: `kpi-platform`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be provisioned

## 2. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. Verify that all tables were created successfully

## 3. Get Your Connection Details

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)
   - **Service Role Key** (for server-side operations)

3. Go to **Settings** → **Database**
4. Copy the **Connection String** for Node.js

## 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# For direct database connection (if needed)
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Application
NODE_ENV=development
```

## 5. Verify Setup

You can verify the setup by:

1. Going to **Table Editor** in Supabase dashboard
2. You should see tables: `categories`, `kpis`, `metrics`
3. Check that 4 default categories were inserted
4. Try inserting a test row manually

## 6. Database Features

### Tables Created
- **categories**: Organize KPIs into categories
- **kpis**: Key Performance Indicators
- **metrics**: Historical metric data points

### Automatic Features
- UUID primary keys
- Automatic timestamps (created_at, updated_at)
- Automatic trend calculation on KPI updates
- Automatic KPI value updates when metrics are added
- Indexes for optimal query performance

### Built-in Functions
- `calculate_trend()`: Calculates up/down/stable trend
- `update_updated_at_column()`: Auto-updates timestamps
- `update_kpi_trend()`: Auto-calculates trends
- `update_kpi_on_metric_insert()`: Updates KPI when metric added

## 7. Optional: Enable Row Level Security

For production with authentication, uncomment the RLS policies in the schema:

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
```

## 8. Monitoring

Supabase provides:
- **Database** → **Logs**: View query logs
- **Database** → **Query Performance**: Identify slow queries
- **Database** → **Backups**: Automatic daily backups (paid plans)

## 9. Migrations

For future schema changes:

1. Create a new SQL file in `supabase/migrations/`
2. Name it with timestamp: `20240101_add_feature.sql`
3. Run it via SQL Editor
4. Keep track of applied migrations

## Troubleshooting

### Connection Issues
- Verify your API keys are correct
- Check that your IP is allowed (Supabase allows all by default)
- Ensure your project is not paused (free tier)

### Query Errors
- Check the Logs section in Supabase dashboard
- Verify table names match exactly (lowercase)
- Ensure UUID format is correct

### Performance
- Check indexes are created (use EXPLAIN ANALYZE)
- Consider adding more indexes for frequent queries
- Monitor query performance in dashboard
