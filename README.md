# KPI Platform - Monitoring and Tracking System

A comprehensive KPI (Key Performance Indicator) monitoring and tracking platform built with React, Vercel Serverless Functions, and Supabase (PostgreSQL).

## Features

- **Dashboard Overview**: Real-time visualization of all KPIs and performance metrics
- **KPI Management**: Create, update, and track KPIs with customizable targets
- **Metrics Tracking**: Record and visualize metric data over time
- **Categories**: Organize KPIs into custom categories
- **Trends Analysis**: Track performance trends with interactive charts
- **Performance Monitoring**: Automatic calculation of KPI performance against targets
- **Flexible Units**: Support for numbers, percentages, currency, time, and custom units
- **Data Visualization**: Interactive charts and graphs using Recharts
- **RESTful API**: Comprehensive API for programmatic access
- **Serverless Architecture**: Deployed on Vercel with automatic scaling
- **PostgreSQL Database**: Powered by Supabase for reliability and performance

## Tech Stack

### Backend
- **Vercel Serverless Functions**: API endpoints
- **Supabase**: PostgreSQL database with real-time capabilities
- **@supabase/supabase-js**: Supabase client library

### Frontend
- **React 18**: Modern UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Recharts**: Data visualization library
- **date-fns**: Date formatting utilities

## Quick Start

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier available)
- A Vercel account (free tier available)

### 2. Set Up Supabase

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase/schema.sql`
4. Get your connection details from Settings → API:
   - Project URL
   - Anon/Public Key
   - Service Role Key

See `supabase/SETUP.md` for detailed instructions.

### 3. Clone and Install

```bash
git clone <repository-url>
cd kpi-platform
npm run install:all
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=development
```

### 5. Run Development Server

```bash
npm run dev
```

This starts the Vercel dev server which runs both the frontend and API functions locally.

Access the application at: **http://localhost:3000**

## Deployment to Vercel

### Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Deploy to Production**
   ```bash
   npm run deploy
   ```

### Deploy via Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

6. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## API Documentation

Full API documentation available in [API.md](./API.md)

**Base URL**: `https://your-project.vercel.app/api`

**Key Endpoints**:
- Health: `GET /api/health`
- KPIs: `GET/POST /api/kpis`, `GET/PUT/DELETE /api/kpis/:id`
- Metrics: `GET/POST /api/metrics`, `POST /api/metrics/bulk`
- Categories: `GET/POST /api/categories`
- Dashboard: `GET /api/dashboard/overview`, `/trends`, `/performance`

## Usage Guide

### Creating Categories
1. Navigate to "Categories"
2. Click "+ Add Category"
3. Fill in name, description, color
4. Click "Create"

### Creating KPIs
1. Go to "KPIs" or dashboard
2. Click "+ Add KPI"
3. Configure:
   - Basic info (name, description, category)
   - Unit type and custom unit if needed
   - Target value and type (maximize/minimize/maintain)
   - Frequency (daily/weekly/monthly/quarterly/yearly)
   - Tags for organization
4. Click "Create KPI"

### Adding Metrics
1. Open a KPI detail page
2. Click "+ Add Metric"
3. Enter value, period, and date range
4. Add optional notes
5. Click "Add Metric"

KPIs automatically update with new metrics and trend calculations.

## Database Features

### Automatic Features
- UUID primary keys
- Auto-updated timestamps
- Automatic trend calculation
- KPI value updates on metric insertion
- Optimized indexes

### Built-in Functions
- `calculate_trend()`: Calculates up/down/stable
- `update_kpi_trend()`: Auto-calculates trends
- `update_kpi_on_metric_insert()`: Updates KPI values

## Monitoring

### Supabase Dashboard
- View database tables and data
- Run SQL queries
- Monitor query performance
- Check logs
- Manage backups

### Vercel Dashboard
- Deployment history
- Function logs
- Performance analytics
- Real-time monitoring

## Troubleshooting

**API 500 Errors**: Check Vercel logs and verify environment variables

**Database Connection**: Verify Supabase URL and keys, check project status

**Frontend Issues**: Check browser console, verify API routes deployed

## Security Best Practices

1. Never commit `.env` files
2. Use Service Role Key only on backend
3. Enable Row Level Security (RLS) for production
4. Implement authentication
5. Rate limit API endpoints

## Performance

- Database indexes for optimal queries
- Vercel CDN for static assets
- Automatic function scaling
- Optimized React bundle

## License

MIT License

## Support

- GitHub Issues
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## Roadmap

- [ ] User authentication (Supabase Auth)
- [ ] Role-based access control
- [ ] Real-time updates with Supabase subscriptions
- [ ] Email notifications
- [ ] CSV/Excel export
- [ ] Mobile app
- [ ] Dark mode
- [ ] Webhooks
- [ ] Custom widgets
