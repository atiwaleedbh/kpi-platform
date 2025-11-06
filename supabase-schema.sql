-- ============================================
-- KPI Platform - Complete Database Schema
-- ============================================
-- This script creates all tables, relationships, and security policies
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- ============================================
-- 1. EXTENSIONS
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable ltree for hierarchical data
CREATE EXTENSION IF NOT EXISTS "ltree";

-- ============================================
-- 2. ENUMS (Custom Types)
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM (
  'super_admin',  -- Platform configuration
  'admin',        -- Organization management
  'manager',      -- Department management
  'operator',     -- Data entry
  'viewer'        -- Read-only access
);

-- KPI categories
CREATE TYPE kpi_category AS ENUM (
  'production',
  'quality',
  'safety',
  'financial',
  'delivery',
  'maintenance',
  'environmental',
  'hr',
  'custom'
);

-- Calculation types
CREATE TYPE calculation_type AS ENUM (
  'manual',      -- User enters value directly
  'calculated',  -- Calculated from other KPIs
  'api'          -- Fetched from external API
);

-- Data types
CREATE TYPE data_type AS ENUM (
  'number',
  'percentage',
  'currency',
  'time',
  'ratio'
);

-- Aggregation methods
CREATE TYPE aggregation_method AS ENUM (
  'sum',
  'average',
  'min',
  'max',
  'last',
  'weighted_average',
  'custom'
);

-- Frequency types
CREATE TYPE frequency_type AS ENUM (
  'hourly',
  'shift',
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
);

-- Target types
CREATE TYPE target_type AS ENUM (
  'maximize',   -- Higher is better
  'minimize',   -- Lower is better
  'maintain',   -- Stay at target
  'range'       -- Stay within range
);

-- Entry types
CREATE TYPE entry_type AS ENUM (
  'manual',
  'calculated',
  'api',
  'imported'
);

-- Calculation operations
CREATE TYPE calculation_operation AS ENUM (
  'add',
  'subtract',
  'multiply',
  'divide',
  'percentage',
  'custom'
);

-- Widget types
CREATE TYPE widget_type AS ENUM (
  'kpi_card',
  'line_chart',
  'bar_chart',
  'gauge',
  'table',
  'heatmap',
  'pie_chart',
  'area_chart'
);

-- Access levels
CREATE TYPE access_level AS ENUM (
  'view',
  'edit',
  'admin'
);

-- Issue types
CREATE TYPE issue_type AS ENUM (
  'out_of_target',
  'trend_negative',
  'anomaly',
  'missing_data'
);

-- Severity levels
CREATE TYPE severity_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Issue status
CREATE TYPE issue_status AS ENUM (
  'open',
  'investigating',
  'resolved',
  'closed'
);

-- ============================================
-- 3. CORE TABLES
-- ============================================

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vision_statement TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extended user profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  department_id UUID, -- will reference departments table
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments (hierarchical structure)
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  parent_department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  path LTREE, -- For efficient hierarchy queries
  manager_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  code TEXT, -- Short code (e.g., "PROD", "QA")
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Add foreign key from user_profiles to departments
ALTER TABLE user_profiles
ADD CONSTRAINT fk_user_department
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- KPI Definitions (global KPI templates)
CREATE TABLE kpi_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL, -- Unique identifier (e.g., "OEE", "MTBF")
  unit TEXT, -- e.g., "%", "hours", "units"
  category kpi_category NOT NULL DEFAULT 'custom',
  calculation_type calculation_type NOT NULL DEFAULT 'manual',
  calculation_formula TEXT, -- For calculated KPIs
  data_type data_type NOT NULL DEFAULT 'number',
  aggregation_method aggregation_method DEFAULT 'average',
  frequency frequency_type DEFAULT 'daily',
  is_cascading BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Department KPIs (KPI instances assigned to departments)
CREATE TABLE department_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
  kpi_definition_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  target_value NUMERIC,
  target_min NUMERIC,
  target_max NUMERIC,
  target_type target_type DEFAULT 'maximize',
  weight NUMERIC DEFAULT 1.0, -- For weighted aggregations
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, kpi_definition_id)
);

-- KPI Calculation Dependencies (for calculated KPIs)
CREATE TABLE kpi_calculation_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_kpi_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  dependent_kpi_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  operation calculation_operation NOT NULL DEFAULT 'multiply',
  coefficient NUMERIC DEFAULT 1.0,
  custom_formula TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_kpi_id, dependent_kpi_id)
);

-- KPI Entries (actual data points)
CREATE TABLE kpi_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_kpi_id UUID REFERENCES department_kpis(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  entry_date DATE NOT NULL, -- For easier querying
  entry_type entry_type NOT NULL DEFAULT 'manual',
  source TEXT, -- e.g., "manual_entry", "machine_api", "calculation"
  notes TEXT,
  entered_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast querying
CREATE INDEX idx_kpi_entries_dept_kpi ON kpi_entries(department_kpi_id);
CREATE INDEX idx_kpi_entries_date ON kpi_entries(entry_date);
CREATE INDEX idx_kpi_entries_period ON kpi_entries(period_start, period_end);

-- KPI Calculations Log (audit trail for calculations)
CREATE TABLE kpi_calculations_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_entry_id UUID REFERENCES kpi_entries(id) ON DELETE CASCADE NOT NULL,
  calculation_formula TEXT NOT NULL,
  input_values JSONB NOT NULL, -- Stores the input KPI values used
  result NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'success', -- 'success' or 'failed'
  error_message TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. DASHBOARD TABLES
-- ============================================

-- Dashboards
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  layout JSONB DEFAULT '[]', -- Widget positions and sizes
  filters JSONB DEFAULT '{}', -- Default filters
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard Widgets
CREATE TABLE dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE NOT NULL,
  widget_type widget_type NOT NULL,
  title TEXT NOT NULL,
  config JSONB DEFAULT '{}', -- Widget-specific configuration
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 4,
  height INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard Access Control
CREATE TABLE dashboard_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  access_level access_level NOT NULL DEFAULT 'view',
  granted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dashboard_id, user_id)
);

-- ============================================
-- 5. FUTURE-READY TABLES (Infrastructure)
-- ============================================

-- API Connections (for automated data ingestion)
CREATE TABLE api_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'rest', 'mqtt', 'opc_ua', 'webhook'
  endpoint TEXT NOT NULL,
  auth_type TEXT, -- 'none', 'api_key', 'oauth', 'basic'
  auth_config JSONB, -- Encrypted credentials
  mapping_config JSONB, -- Maps API data fields to KPIs
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPI Issues (when KPIs are out of target)
CREATE TABLE kpi_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_entry_id UUID REFERENCES kpi_entries(id) ON DELETE CASCADE NOT NULL,
  issue_type issue_type NOT NULL,
  severity severity_level NOT NULL DEFAULT 'medium',
  status issue_status NOT NULL DEFAULT 'open',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Root Cause Analyses
CREATE TABLE root_cause_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_issue_id UUID REFERENCES kpi_issues(id) ON DELETE CASCADE NOT NULL,
  analysis_type TEXT NOT NULL, -- 'fishbone', '5_whys', 'pareto', 'fmea'
  analysis_data JSONB NOT NULL, -- Stores the analysis structure
  root_causes JSONB, -- Identified root causes
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corrective Actions
CREATE TABLE corrective_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  root_cause_analysis_id UUID REFERENCES root_cause_analyses(id) ON DELETE CASCADE NOT NULL,
  action_description TEXT NOT NULL,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
  effectiveness NUMERIC, -- Measured after implementation (0-100)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- AI Insights (for GPT integration)
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_issue_id UUID REFERENCES kpi_issues(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'diagnosis', 'recommendation', 'prediction'
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence_score NUMERIC, -- 0-1
  model_version TEXT,
  feedback JSONB, -- User feedback on quality
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. AUDIT & ACTIVITY LOG
-- ============================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'view'
  entity_type TEXT NOT NULL, -- 'kpi', 'entry', 'dashboard', etc.
  entity_id UUID NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- ============================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpi_definitions_updated_at BEFORE UPDATE ON kpi_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_kpis_updated_at BEFORE UPDATE ON department_kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpi_entries_updated_at BEFORE UPDATE ON kpi_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update department path (ltree)
CREATE OR REPLACE FUNCTION update_department_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_department_id IS NULL THEN
    NEW.path = NEW.id::text::ltree;
    NEW.level = 0;
  ELSE
    SELECT path || NEW.id::text::ltree, level + 1
    INTO NEW.path, NEW.level
    FROM departments
    WHERE id = NEW.parent_department_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_department_path
  BEFORE INSERT OR UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_department_path();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_access ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles in their organization"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'admin')
      AND up.organization_id = user_profiles.organization_id
    )
  );

-- Departments Policies
CREATE POLICY "Users can view departments in their organization"
  ON departments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.organization_id = departments.organization_id
    )
  );

CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('super_admin', 'admin')
      AND user_profiles.organization_id = departments.organization_id
    )
  );

-- KPI Definitions Policies
CREATE POLICY "Users can view KPI definitions in their organization"
  ON kpi_definitions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.organization_id = kpi_definitions.organization_id
    )
  );

CREATE POLICY "Admins can manage KPI definitions"
  ON kpi_definitions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('super_admin', 'admin')
      AND user_profiles.organization_id = kpi_definitions.organization_id
    )
  );

-- KPI Entries Policies
CREATE POLICY "Users can view entries for their department and children"
  ON kpi_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN departments user_dept ON up.department_id = user_dept.id
      JOIN department_kpis dk ON dk.id = kpi_entries.department_kpi_id
      JOIN departments kpi_dept ON dk.department_id = kpi_dept.id
      WHERE up.id = auth.uid()
      AND (kpi_dept.path <@ user_dept.path OR kpi_dept.id = user_dept.id)
    )
  );

CREATE POLICY "Operators can insert entries for their department"
  ON kpi_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN department_kpis dk ON dk.department_id = up.department_id
      WHERE up.id = auth.uid()
      AND up.role IN ('operator', 'manager', 'admin', 'super_admin')
      AND dk.id = kpi_entries.department_kpi_id
    )
  );

-- Dashboards Policies
CREATE POLICY "Users can view their own dashboards"
  ON dashboards FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can view public dashboards in their organization"
  ON dashboards FOR SELECT
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.organization_id = dashboards.organization_id
    )
  );

CREATE POLICY "Users can manage their own dashboards"
  ON dashboards FOR ALL
  USING (created_by = auth.uid());

-- ============================================
-- 9. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a sample organization
INSERT INTO organizations (id, name, vision_statement)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Sample Manufacturing Plant',
  'To achieve operational excellence through continuous improvement and data-driven decision making'
);

-- Note: After running this schema, you'll need to:
-- 1. Create your first user through Supabase Auth
-- 2. Insert a user_profile with role 'super_admin'
-- 3. Start creating departments and KPIs through the application

-- ============================================
-- SCHEMA COMPLETE!
-- ============================================
-- Next steps:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Check for any errors and fix them
-- 3. Verify all tables are created
-- 4. Set up your first super_admin user
-- 5. Start using the application!
