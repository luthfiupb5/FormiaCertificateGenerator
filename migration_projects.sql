-- ==============================================================================
-- MIGRATION: Add Projects and Generated Certificates Tables
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- 1. Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text,
  
  -- Canvas/Design Data (stored as JSONB for flexibility)
  canvas_data jsonb, -- Stores canvas elements, positions, styles, etc.
  
  -- Template and thumbnails
  template_url text, -- URL to the template image/PDF in R2
  thumbnail_url text, -- URL to the thumbnail preview in R2
  
  -- Data mapping
  data_file_url text, -- URL to the uploaded CSV/Excel data file in R2
  field_mappings jsonb, -- Stores the mapping between canvas fields and data columns
  
  -- Generated certificates
  generated_count integer default 0, -- Number of certificates generated
  last_generated_at timestamp with time zone,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Status
  status text default 'draft' check (status in ('draft', 'ready', 'generating', 'completed'))
);

-- 2. Enable RLS on projects
alter table public.projects enable row level security;

-- 3. Create Policy: Users can view their own projects
create policy "Users can view own projects"
  on projects for select
  using ( (select auth.uid()) = user_id );

-- 4. Create Policy: Users can insert their own projects
create policy "Users can insert own projects"
  on projects for insert
  with check ( (select auth.uid()) = user_id );

-- 5. Create Policy: Users can update their own projects
create policy "Users can update own projects"
  on projects for update
  using ( (select auth.uid()) = user_id );

-- 6. Create Policy: Users can delete their own projects
create policy "Users can delete own projects"
  on projects for delete
  using ( (select auth.uid()) = user_id );

-- 7. Create index for faster queries
create index projects_user_id_idx on public.projects(user_id);
create index projects_updated_at_idx on public.projects(updated_at desc);

-- 8. Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 9. Create trigger to automatically update updated_at
create trigger on_project_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- GENERATED CERTIFICATES TABLE (Optional - for tracking individual certificates)
-- ==============================================================================

-- 10. Create generated_certificates table
create table public.generated_certificates (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references public.projects on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  
  -- Certificate details
  file_url text not null, -- URL to the generated certificate in R2
  recipient_data jsonb, -- Stores the recipient's data used for this certificate
  
  -- Metadata
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  file_size bigint, -- File size in bytes
  file_format text -- e.g., 'pdf', 'png', 'jpg'
);

-- 11. Enable RLS on generated_certificates
alter table public.generated_certificates enable row level security;

-- 12. Create policies for generated_certificates
create policy "Users can view own certificates"
  on generated_certificates for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert own certificates"
  on generated_certificates for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete own certificates"
  on generated_certificates for delete
  using ( (select auth.uid()) = user_id );

-- 13. Create indexes for generated_certificates
create index generated_certificates_project_id_idx on public.generated_certificates(project_id);
create index generated_certificates_user_id_idx on public.generated_certificates(user_id);
create index generated_certificates_generated_at_idx on public.generated_certificates(generated_at desc);
