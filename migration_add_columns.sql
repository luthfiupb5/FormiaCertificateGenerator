-- Add missing columns to existing projects table
-- Run this AFTER running migration_projects.sql

-- Add original_file_name column
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS original_file_name text;

-- Add csv_url column (alias for data_file_url, or we can use data_file_url and update Editor)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS csv_url text;
