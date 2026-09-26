-- 1. PROFILES: one row per user
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- 2. SUBSCRIPTIONS: who paid, which plan, is it active
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('stripe', 'paystack')),
  provider_customer_id text,
  provider_subscription_id text unique,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_id_idx on public.subscriptions(user_id);

-- 3. SECURITY: users only see their own data
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can view own subscriptions"
  on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

-- 4. ACCESS: users can read, but only edit name + avatar (not role)
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;
grant all on public.profiles, public.subscriptions to service_role;

-- 5. AUTO-CREATE a profile whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Add profiles for users who already signed up
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;