// TypeScript types for database tables
// Generated from Supabase schema

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'operator'
  | 'viewer';

export type KPICategory =
  | 'production'
  | 'quality'
  | 'safety'
  | 'financial'
  | 'delivery'
  | 'maintenance'
  | 'environmental'
  | 'hr'
  | 'custom';

export type CalculationType =
  | 'manual'
  | 'calculated'
  | 'api';

export type DataType =
  | 'number'
  | 'percentage'
  | 'currency'
  | 'time'
  | 'ratio';

export type AggregationMethod =
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'last'
  | 'weighted_average'
  | 'custom';

export type FrequencyType =
  | 'hourly'
  | 'shift'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export type TargetType =
  | 'maximize'
  | 'minimize'
  | 'maintain'
  | 'range';

export type EntryType =
  | 'manual'
  | 'calculated'
  | 'api'
  | 'imported';

export type WidgetType =
  | 'kpi_card'
  | 'line_chart'
  | 'bar_chart'
  | 'gauge'
  | 'table'
  | 'heatmap'
  | 'pie_chart'
  | 'area_chart';

export type AccessLevel =
  | 'view'
  | 'edit'
  | 'admin';

// Database table types

export interface Organization {
  id: string;
  name: string;
  vision_statement?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  organization_id?: string;
  is_active: boolean;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parent_department_id?: string;
  organization_id: string;
  level: number;
  path?: string;
  manager_id?: string;
  code?: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KPIDefinition {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  code: string;
  unit?: string;
  category: KPICategory;
  calculation_type: CalculationType;
  calculation_formula?: string;
  data_type: DataType;
  aggregation_method?: AggregationMethod;
  frequency?: FrequencyType;
  is_cascading: boolean;
  is_active: boolean;
  created_by?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DepartmentKPI {
  id: string;
  department_id: string;
  kpi_definition_id: string;
  target_value?: number;
  target_min?: number;
  target_max?: number;
  target_type: TargetType;
  weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KPIEntry {
  id: string;
  department_kpi_id: string;
  value: number;
  period_start: string;
  period_end: string;
  entry_date: string;
  entry_type: EntryType;
  source?: string;
  notes?: string;
  entered_by?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  organization_id: string;
  is_public: boolean;
  layout: any[];
  filters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  widget_type: WidgetType;
  title: string;
  config: Record<string, any>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

// Extended types with relations

export interface DepartmentWithRelations extends Department {
  manager?: UserProfile;
  parent_department?: Department;
  children?: Department[];
  kpis?: DepartmentKPI[];
}

export interface KPIDefinitionWithRelations extends KPIDefinition {
  created_by_user?: UserProfile;
  department_kpis?: DepartmentKPI[];
}

export interface DepartmentKPIWithRelations extends DepartmentKPI {
  department?: Department;
  kpi_definition?: KPIDefinition;
  entries?: KPIEntry[];
  latest_entry?: KPIEntry;
}

export interface KPIEntryWithRelations extends KPIEntry {
  department_kpi?: DepartmentKPIWithRelations;
  entered_by_user?: UserProfile;
}

export interface DashboardWithRelations extends Dashboard {
  created_by_user?: UserProfile;
  widgets?: DashboardWidget[];
  access?: DashboardAccess[];
}

export interface DashboardAccess {
  id: string;
  dashboard_id: string;
  user_id: string;
  access_level: AccessLevel;
  granted_by?: string;
  granted_at: string;
}

// API Response types

export interface KPIStats {
  current_value: number;
  target_value: number;
  performance: number;
  trend: 'up' | 'down' | 'stable';
  percent_change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface DepartmentStats {
  department_id: string;
  department_name: string;
  total_kpis: number;
  active_kpis: number;
  avg_performance: number;
  on_target_count: number;
  off_target_count: number;
}

// Form types

export interface KPIDefinitionForm {
  name: string;
  description?: string;
  code: string;
  unit?: string;
  category: KPICategory;
  calculation_type: CalculationType;
  calculation_formula?: string;
  data_type: DataType;
  aggregation_method?: AggregationMethod;
  frequency?: FrequencyType;
  is_cascading: boolean;
}

export interface DepartmentForm {
  name: string;
  description?: string;
  parent_department_id?: string;
  manager_id?: string;
  code?: string;
}

export interface KPIEntryForm {
  department_kpi_id: string;
  value: number;
  period_start: string;
  period_end: string;
  notes?: string;
}

export interface DashboardForm {
  name: string;
  description?: string;
  is_public: boolean;
}
