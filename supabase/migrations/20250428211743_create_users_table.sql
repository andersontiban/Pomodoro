create table users (
  id bigint primary key generated always as identity,
  email text,
  subscription_status boolean,
  created_at timestamptz default now()
);