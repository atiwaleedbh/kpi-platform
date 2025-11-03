-- KPI Platform Database Schema for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'chart-bar',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPIs Table
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  unit VARCHAR(50) NOT NULL CHECK (unit IN ('number', 'percentage', 'currency', 'time', 'custom')),
  custom_unit VARCHAR(100),
  target_value DECIMAL(15, 2),
  target_type VARCHAR(20) DEFAULT 'maximize' CHECK (target_type IN ('minimize', 'maximize', 'maintain')),
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  current_value DECIMAL(15, 2) DEFAULT 0,
  previous_value DECIMAL(15, 2) DEFAULT 0,
  trend VARCHAR(10) DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics Table
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
  value DECIMAL(15, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  metadata JSONB,
  created_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_kpis_category_id ON kpis(category_id);
CREATE INDEX idx_kpis_status ON kpis(status);
CREATE INDEX idx_metrics_kpi_id ON metrics(kpi_id);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp DESC);
CREATE INDEX idx_metrics_period ON metrics(period);
CREATE INDEX idx_metrics_period_range ON metrics(period_start, period_end);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate trend
CREATE OR REPLACE FUNCTION calculate_trend(current_val DECIMAL, previous_val DECIMAL)
RETURNS VARCHAR(10) AS $$
BEGIN
  IF current_val > previous_val THEN
    RETURN 'up';
  ELSIF current_val < previous_val THEN
    RETURN 'down';
  ELSE
    RETURN 'stable';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update KPI trend
CREATE OR REPLACE FUNCTION update_kpi_trend()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_value IS NOT NULL AND NEW.previous_value IS NOT NULL THEN
    NEW.trend = calculate_trend(NEW.current_value, NEW.previous_value);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kpi_trend_trigger
  BEFORE INSERT OR UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_kpi_trend();

-- Function to update KPI values when a new metric is added
CREATE OR REPLACE FUNCTION update_kpi_on_metric_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE kpis
  SET
    previous_value = current_value,
    current_value = NEW.value
  WHERE id = NEW.kpi_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kpi_on_metric_trigger
  AFTER INSERT ON metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_kpi_on_metric_insert();

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
  ('Finance', 'Financial metrics and KPIs', '#10B981', 'chart-bar'),
  ('Operations', 'Operational efficiency metrics', '#3B82F6', 'settings'),
  ('Marketing', 'Marketing performance indicators', '#F59E0B', 'trending-up'),
  ('Customer', 'Customer satisfaction and engagement', '#8B5CF6', 'users');

-- Row Level Security (RLS) - Enable for production
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (uncomment for production with auth)
-- CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON kpis FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON metrics FOR SELECT USING (true);
