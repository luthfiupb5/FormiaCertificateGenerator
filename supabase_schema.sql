-- 1. Create a table for public profiles linked to auth.users
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

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
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
