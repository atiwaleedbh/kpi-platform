# KPI Management Platform - Complete Architecture

## 🎯 Platform Overview

A comprehensive, enterprise-grade KPI Management Platform built with Next.js 14 and Supabase, designed for manufacturing plants, departments, and organizations to track, analyze, and improve performance metrics.

## 🏗️ System Architecture

### Technology Stack

**Frontend & Backend:**
- **Next.js 14** (App Router)
  - Server Components for optimal performance
  - API Routes for backend logic
  - TypeScript for type safety
  - Server Actions for mutations

**Database & Authentication:**
- **Supabase**
  - PostgreSQL database
  - Row Level Security (RLS)
  - Built-in authentication
  - Real-time subscriptions
  - Storage for future file uploads

**Deployment:**
- **Vercel** (Edge Network, automatic scaling)

**UI Libraries:**
- Tailwind CSS for styling
- shadcn/ui for components
- Recharts for data visualization
- React Hook Form for forms
- Zod for validation

## 📊 Database Schema Design

### Core Tables

#### 1. **users** (Supabase Auth + Extended)
```sql
- id (uuid, primary key)
- email (text)
- role (enum: 'super_admin', 'admin', 'manager', 'operator', 'viewer')
- department_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)
- full_name (text)
- is_active (boolean)
```

#### 2. **organizations**
```sql
- id (uuid, primary key)
- name (text)
- vision_statement (text)
- created_at (timestamp)
- updated_at (timestamp)
- settings (jsonb) -- platform-wide settings
```

#### 3. **departments**
```sql
- id (uuid, primary key)
- name (text)
- parent_department_id (uuid, nullable, self-reference)
- organization_id (uuid, foreign key)
- level (integer) -- 0 = top level, 1 = sub-dept, etc.
- path (ltree) -- PostgreSQL ltree for efficient hierarchy queries
- manager_id (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)
- description (text)
```

#### 4. **kpi_definitions**
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- code (text, unique) -- e.g., "OEE", "MTBF", "RFT"
- unit (text) -- e.g., "%", "hours", "units"
- category (enum: 'production', 'quality', 'safety', 'financial', 'custom')
- calculation_type (enum: 'manual', 'calculated', 'api')
- calculation_formula (text) -- for calculated KPIs
- data_type (enum: 'number', 'percentage', 'currency', 'time')
- aggregation_method (enum: 'sum', 'average', 'min', 'max', 'last', 'custom')
- frequency (enum: 'hourly', 'shift', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly')
- is_cascading (boolean) -- can this KPI cascade up/down
- created_by (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)
- is_active (boolean)
```

#### 5. **department_kpis**
```sql
- id (uuid, primary key)
- department_id (uuid, foreign key)
- kpi_definition_id (uuid, foreign key)
- target_value (numeric)
- target_min (numeric, nullable) -- for range targets
- target_max (numeric, nullable)
- target_type (enum: 'maximize', 'minimize', 'maintain', 'range')
- weight (numeric) -- importance weight for rollup calculations
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. **kpi_calculation_dependencies**
```sql
- id (uuid, primary key)
- parent_kpi_id (uuid, foreign key to kpi_definitions)
- dependent_kpi_id (uuid, foreign key to kpi_definitions)
- operation (enum: 'add', 'subtract', 'multiply', 'divide', 'custom')
- coefficient (numeric, default 1) -- multiplier for the dependency
- custom_formula (text, nullable) -- for complex calculations
- created_at (timestamp)
```

#### 7. **kpi_entries**
```sql
- id (uuid, primary key)
- department_kpi_id (uuid, foreign key)
- value (numeric)
- period_start (timestamp)
- period_end (timestamp)
- entry_date (date) -- for easier querying
- entry_type (enum: 'manual', 'calculated', 'api')
- source (text) -- e.g., "manual_entry", "calculation_engine", "machine_api"
- notes (text)
- entered_by (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)
- metadata (jsonb) -- for flexible additional data
```

#### 8. **kpi_calculations_log**
```sql
- id (uuid, primary key)
- kpi_entry_id (uuid, foreign key)
- calculation_formula (text)
- input_values (jsonb) -- stores the values used in calculation
- result (numeric)
- calculated_at (timestamp)
- status (enum: 'success', 'failed')
- error_message (text, nullable)
```

#### 9. **dashboards**
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- created_by (uuid, foreign key to users)
- is_public (boolean)
- layout (jsonb) -- stores widget positions and sizes
- filters (jsonb) -- default filters
- created_at (timestamp)
- updated_at (timestamp)
```

#### 10. **dashboard_widgets**
```sql
- id (uuid, primary key)
- dashboard_id (uuid, foreign key)
- widget_type (enum: 'kpi_card', 'line_chart', 'bar_chart', 'gauge', 'table', 'heatmap')
- title (text)
- config (jsonb) -- widget-specific configuration
- position_x (integer)
- position_y (integer)
- width (integer)
- height (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 11. **dashboard_access**
```sql
- id (uuid, primary key)
- dashboard_id (uuid, foreign key)
- user_id (uuid, foreign key)
- access_level (enum: 'view', 'edit', 'admin')
- granted_by (uuid, foreign key to users)
- granted_at (timestamp)
```

### Future Tables (Infrastructure Ready)

#### 12. **api_connections** (Future: API Integration)
```sql
- id (uuid, primary key)
- name (text)
- type (enum: 'rest', 'mqtt', 'opc_ua', 'webhook')
- endpoint (text)
- auth_type (enum: 'none', 'api_key', 'oauth', 'basic')
- auth_config (jsonb, encrypted)
- mapping_config (jsonb) -- maps API data to KPIs
- is_active (boolean)
- last_sync (timestamp)
- created_at (timestamp)
```

#### 13. **kpi_issues** (Future: Lean Tools Integration)
```sql
- id (uuid, primary key)
- kpi_entry_id (uuid, foreign key)
- issue_type (enum: 'out_of_target', 'trend_negative', 'anomaly')
- severity (enum: 'low', 'medium', 'high', 'critical')
- status (enum: 'open', 'investigating', 'resolved', 'closed')
- detected_at (timestamp)
- resolved_at (timestamp, nullable)
- assigned_to (uuid, foreign key to users)
```

#### 14. **root_cause_analyses**
```sql
- id (uuid, primary key)
- kpi_issue_id (uuid, foreign key)
- analysis_type (enum: 'fishbone', '5_whys', 'pareto', 'fmea')
- analysis_data (jsonb) -- stores fishbone diagram, 5 whys, etc.
- root_causes (jsonb) -- identified root causes
- created_by (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 15. **corrective_actions**
```sql
- id (uuid, primary key)
- root_cause_analysis_id (uuid, foreign key)
- action_description (text)
- assigned_to (uuid, foreign key to users)
- due_date (date)
- status (enum: 'planned', 'in_progress', 'completed', 'cancelled')
- effectiveness (numeric, nullable) -- measured after implementation
- created_at (timestamp)
- completed_at (timestamp, nullable)
```

#### 16. **ai_insights** (Future: GPT Integration)
```sql
- id (uuid, primary key)
- kpi_issue_id (uuid, foreign key)
- insight_type (enum: 'diagnosis', 'recommendation', 'prediction')
- prompt (text)
- response (text)
- confidence_score (numeric)
- model_version (text)
- created_at (timestamp)
- feedback (jsonb) -- user feedback on insight quality
```

## 🔐 Security & Access Control

### Role Hierarchy
1. **Super Admin** - Platform configuration, organization settings
2. **Admin** - KPI definitions, department management, user management
3. **Manager** - View department KPIs, cascade down, manage team
4. **Operator** - Data entry for assigned KPIs only
5. **Viewer** - Read-only access to dashboards

### Row Level Security (RLS) Policies

**departments:**
- Users can only see their department and children
- Admins can see all departments

**kpi_entries:**
- Operators can insert entries for their department's KPIs
- Users can view entries for their department and sub-departments
- Managers can view aggregated data for their hierarchy

**dashboards:**
- Users can see public dashboards
- Users can see dashboards they have access to
- Creators have full control

## 🎨 Application Structure

### Page Routes

```
/                           → Landing page / redirect to dashboard
/auth
  /login                   → Login page
  /signup                  → Registration (admin invite only)
  /forgot-password         → Password reset

/dashboard                 → Main dashboard (role-based view)
  /overview                → Organization-wide overview (admins)
  /department/[id]         → Department-specific dashboard

/kpis
  /definitions             → KPI definition management (admins)
  /definitions/[id]        → Edit KPI definition
  /definitions/new         → Create new KPI definition
  /entry                   → Data entry interface (operators)
  /entry/[id]              → Entry form for specific KPI
  /view/[id]               → Detailed KPI view with history

/departments
  /                        → Department hierarchy view
  /[id]                    → Department detail page
  /[id]/kpis               → KPIs assigned to department
  /new                     → Create department (admins)

/dashboards
  /                        → User's dashboards list
  /[id]                    → View specific dashboard
  /[id]/edit               → Edit dashboard (drag-drop widgets)
  /new                     → Create new dashboard
  /public                  → Browse public dashboards

/admin
  /users                   → User management
  /settings                → Platform settings
  /audit-log               → Activity audit log

/reports
  /performance             → Performance reports
  /trends                  → Trend analysis
  /export                  → Export data

/future-features (infrastructure ready)
  /api-connections         → API integration management
  /issues                  → KPI issues tracker
  /issues/[id]/rca         → Root cause analysis
  /insights                → AI-powered insights
```

## 🧮 Calculation Engine

### Types of KPIs

#### 1. Manual Entry KPIs
- Production count
- Quality inspection results
- Manual measurements
- Direct operator input

#### 2. Calculated KPIs
**Simple Calculations:**
- OEE = Availability × Performance × Quality
- RFT (Right First Time) = (Good Parts / Total Parts) × 100

**Aggregated Calculations:**
- Department Total = SUM(line KPIs)
- Department Average = AVG(line KPIs)

**Weighted Calculations:**
- Department Score = Σ(KPI_value × KPI_weight) / Σ(weights)

#### 3. Cascading KPIs

**Bottom-Up Aggregation:**
```
Plant OEE = Weighted Average of Department OEEs
Department OEE = Weighted Average of Line OEEs
Line OEE = Availability × Performance × Quality
```

**Top-Down Target Setting:**
```
Plant Target: 85% OEE
  → Production Dept Target: 85% OEE
     → Line 1 Target: 87% OEE
     → Line 2 Target: 83% OEE
```

### Calculation Engine Flow

```
1. Data Entry
   ↓
2. Validate Input
   ↓
3. Store Entry
   ↓
4. Trigger Calculation Engine
   ↓
5. Identify Dependent KPIs
   ↓
6. Calculate in Dependency Order
   ↓
7. Store Calculated Values
   ↓
8. Update Aggregations (Cascade Up)
   ↓
9. Check Targets & Trigger Alerts
   ↓
10. Update Dashboards (Real-time)
```

## 🎨 Color Coding System

### KPI Status Colors

**Performance vs Target:**
- 🟢 Green (100% - 120%): Meeting or exceeding target
- 🟡 Yellow (80% - 99%): Near target, needs attention
- 🟠 Orange (60% - 79%): Below target, action required
- 🔴 Red (< 60%): Critical, immediate action needed

**Configurable Thresholds:**
```javascript
{
  excellent: { min: 100, color: '#10B981' },
  good: { min: 90, max: 99, color: '#84CC16' },
  warning: { min: 75, max: 89, color: '#F59E0B' },
  critical: { max: 74, color: '#EF4444' }
}
```

## 📱 User Interfaces

### 1. Operator Data Entry Interface
- Simple, focused form
- Only shows KPIs assigned to operator
- Quick entry with validation
- Recent entries history
- Mobile-friendly design

### 2. Manager Dashboard
- Department overview cards
- Drill-down hierarchy navigation
- Color-coded KPI status
- Trend charts
- Performance alerts
- Team comparison views

### 3. Admin Interface
- KPI definition management
- Formula builder with validation
- Department structure editor
- User role assignment
- Calculation dependency graph
- System configuration

### 4. Custom Dashboards
- Drag-and-drop widget builder
- Widget library (charts, gauges, tables, cards)
- Filter builder
- Save and share dashboards
- Responsive grid layout
- Export to PDF/Image

## 🚀 Implementation Phases

### Phase 1: Foundation (Current Build)
- ✅ Next.js 14 project setup
- ✅ Supabase integration
- ✅ Database schema creation
- ✅ Authentication system
- ✅ Basic routing structure

### Phase 2: Core Features
- Department hierarchy management
- KPI definition management
- Manual data entry interface
- Basic calculation engine
- Simple dashboards

### Phase 3: Advanced Features
- Complex calculation engine
- Cascade functionality
- Dynamic dashboard builder
- Advanced visualizations
- Role-based access control

### Phase 4: Future-Ready Infrastructure
- API connection framework
- Issues tracking system
- Lean tools integration (fishbone, RCA)
- AI/GPT integration hooks
- Real-time notifications

## 🔄 Real-time Features (Supabase)

### Real-time Subscriptions
```javascript
// Dashboard auto-updates when KPIs change
supabase
  .channel('kpi_updates')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'kpi_entries' },
    (payload) => { /* Update UI */ }
  )
  .subscribe()
```

### Collaborative Features
- Multiple users viewing same dashboard (live updates)
- Real-time calculation propagation
- Instant alert notifications
- Live data entry validation

## 📈 Scalability Considerations

### Database Optimization
- Indexed columns: department_id, kpi_definition_id, entry_date
- Partitioning kpi_entries by date (monthly)
- Materialized views for aggregated data
- Caching calculated values

### Performance
- Server-side rendering for initial load
- Client-side caching with React Query
- Incremental Static Regeneration for reports
- Edge functions for calculations
- Connection pooling

## 🎓 Beginner-Friendly Features

### Built-in Help System
- Tooltips on every field
- Step-by-step wizards
- Video tutorials (embedded)
- Sample data for testing
- Guided tours for new users

### Documentation
- Inline documentation
- API documentation (auto-generated)
- User guides
- Admin guides
- Video tutorials

## 🔧 Development Environment

### Required Tools
1. **Node.js** (v18+) - JavaScript runtime
2. **npm** or **yarn** - Package manager
3. **Git** - Version control
4. **VS Code** (recommended) - Code editor
5. **Supabase CLI** (optional) - Local development

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📦 Deployment Pipeline

### Vercel Deployment
1. Connect GitHub repository
2. Auto-detect Next.js
3. Add environment variables
4. Deploy
5. Automatic deployments on git push

### Production Checklist
- [ ] Environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] Database backups configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured
- [ ] SSL/TLS enabled
- [ ] CDN configured

## 🎯 Success Metrics

### Platform KPIs (Meta!)
- User adoption rate
- Data entry compliance
- Dashboard usage
- Calculation accuracy
- System uptime
- Response time
- User satisfaction score

## 🔮 Future Enhancements

### Roadmap
1. **API Integration** (Phase 4)
   - REST API client
   - MQTT for IoT devices
   - OPC-UA for industrial machines
   - Webhook support

2. **Lean Tools** (Phase 5)
   - Interactive fishbone diagrams
   - 5 Whys analysis
   - Pareto charts
   - FMEA templates
   - Action tracking

3. **AI/ML Features** (Phase 6)
   - GPT-powered insights
   - Anomaly detection
   - Predictive analytics
   - Natural language queries
   - Auto-generated reports

4. **Mobile Apps** (Phase 7)
   - React Native apps
   - Offline data entry
   - Push notifications
   - Mobile dashboards

5. **Advanced Analytics** (Phase 8)
   - Statistical process control (SPC)
   - Six Sigma tools
   - Custom report builder
   - Data science workbench

---

**This architecture provides a solid foundation for an enterprise-grade KPI platform that can scale from a single department to a global organization, with built-in extensibility for future features.**
