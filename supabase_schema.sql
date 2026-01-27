-- 1. Create a table for public profiles linked to auth.users
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create Policy: Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone." 
  on profiles for select 
  using ( true );

-- 4. Create Policy: Users can insert their own profile
create policy "Users can insert their own profile." 
  on profiles for insert 
  with check ( (select auth.uid()) = id );

-- 5. Create Policy: Users can update their own profile
create policy "Users can update own profile." 
  on profiles for update 
  using ( (select auth.uid()) = id );

-- 6. Create a Trigger to automatically handle new user signups
-- This ensures that whenever a user signs up via Auth, a row is created in 'profiles'
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- PROJECTS TABLE - Stores certificate design projects
-- ==============================================================================

-- 7. Create projects table
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

-- 8. Enable RLS on projects
alter table public.projects enable row level security;

-- 9. Create Policy: Users can view their own projects
create policy "Users can view own projects"
  on projects for select
  using ( (select auth.uid()) = user_id );

-- 10. Create Policy: Users can insert their own projects
create policy "Users can insert own projects"
  on projects for insert
  with check ( (select auth.uid()) = user_id );

-- 11. Create Policy: Users can update their own projects
create policy "Users can update own projects"
  on projects for update
  using ( (select auth.uid()) = user_id );

-- 12. Create Policy: Users can delete their own projects
create policy "Users can delete own projects"
  on projects for delete
  using ( (select auth.uid()) = user_id );

-- 13. Create index for faster queries
create index projects_user_id_idx on public.projects(user_id);
create index projects_updated_at_idx on public.projects(updated_at desc);

-- 14. Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 15. Create trigger to automatically update updated_at
create trigger on_project_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- GENERATED CERTIFICATES TABLE (Optional - for tracking individual certificates)
-- ==============================================================================

-- 16. Create generated_certificates table
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

-- 17. Enable RLS on generated_certificates
alter table public.generated_certificates enable row level security;

-- 18. Create policies for generated_certificates
create policy "Users can view own certificates"
  on generated_certificates for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert own certificates"
  on generated_certificates for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete own certificates"
  on generated_certificates for delete
  using ( (select auth.uid()) = user_id );

-- 19. Create indexes for generated_certificates
create index generated_certificates_project_id_idx on public.generated_certificates(project_id);
create index generated_certificates_user_id_idx on public.generated_certificates(user_id);
create index generated_certificates_generated_at_idx on public.generated_certificates(generated_at desc);
