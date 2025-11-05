/**
 * Supabase Database Types
 * This is a simplified version - will be auto-generated in production
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          vision_statement: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vision_statement?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vision_statement?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'super_admin' | 'admin' | 'manager' | 'operator' | 'viewer';
          department_id: string | null;
          organization_id: string | null;
          is_active: boolean;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'super_admin' | 'admin' | 'manager' | 'operator' | 'viewer';
          department_id?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'super_admin' | 'admin' | 'manager' | 'operator' | 'viewer';
          department_id?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_department_id: string | null;
          organization_id: string;
          level: number;
          path: string | null;
          manager_id: string | null;
          code: string | null;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_department_id?: string | null;
          organization_id: string;
          level?: number;
          path?: string | null;
          manager_id?: string | null;
          code?: string | null;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_department_id?: string | null;
          organization_id?: string;
          level?: number;
          path?: string | null;
          manager_id?: string | null;
          code?: string | null;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      kpi_definitions: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          code: string;
          unit: string | null;
          category: string;
          calculation_type: string;
          calculation_formula: string | null;
          data_type: string;
          aggregation_method: string | null;
          frequency: string | null;
          is_cascading: boolean;
          is_active: boolean;
          created_by: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          code: string;
          unit?: string | null;
          category: string;
          calculation_type: string;
          calculation_formula?: string | null;
          data_type: string;
          aggregation_method?: string | null;
          frequency?: string | null;
          is_cascading?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          code?: string;
          unit?: string | null;
          category?: string;
          calculation_type?: string;
          calculation_formula?: string | null;
          data_type?: string;
          aggregation_method?: string | null;
          frequency?: string | null;
          is_cascading?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add more table types as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
