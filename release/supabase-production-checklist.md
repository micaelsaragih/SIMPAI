# SIMPAI Supabase Production Checklist

This checklist reviews database security, schemas, and authentication configuration required before transitioning SIMPAI to production.

## 1. Table Security & Row Level Security (RLS)

Every table in the Supabase schema must have Row Level Security active to prevent unauthorized data exposure.

- [x] **Profiles Table (`profiles`)**:
  - RLS Status: **ENABLED**
  - Read Policy: `auth.uid() = id` (Users can only view their own profile)
  - Write Policy: `auth.uid() = id` (Users can only modify their own profile)
- [x] **User Settings Table (`user_settings`)**:
  - RLS Status: **ENABLED**
  - Read Policy: `auth.uid() = user_id`
  - Write Policy: `auth.uid() = user_id`
- [x] **Templates Table (`templates`)**:
  - RLS Status: **ENABLED**
  - Read Policy: `true` (Allows all users to read reference templates)
  - Write Policy: `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin' OR role = 'lecturer')` (Restricts adding/modifying templates to admins/lecturers)

## 2. Trigger Functions & Automation

To automate profile management, we require Postgres trigger functions to run on specific table operations.

- [x] **New User Onboarding Trigger (`handle_new_user`)**:
  - Trigger event: `AFTER INSERT ON auth.users`
  - Action: Creates a row in `profiles` and `user_settings` with default values (theme, role = 'student').
- [x] **Modified Timestamp Trigger (`handle_updated_at`)**:
  - Trigger event: `BEFORE UPDATE` on all tables
  - Action: Automatically bumps the `updated_at` column.

## 3. Database Validation & Integrity

- [x] **Foreign Key Constraints**:
  - Profiles are linked to `auth.users` via `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE`.
  - Settings are linked to `profiles` via `user_settings.user_id REFERENCES profiles(id) ON DELETE CASCADE`.
- [x] **Check Constraints**:
  - `profiles.role` must be one of: `'student'`, `'lecturer'`, `'admin'`.
  - `user_settings.theme` must be one of: `'light'`, `'dark'`, `'system'`.

## 4. Auth & Redirect Whitelisting

When using Supabase Auth in production, email redirection callback templates must be authorized:

- [ ] **Config URL**: Add your deployed production URL (e.g. `https://simpai.vercel.app/auth/callback`) to the **Redirect URLs** input in the Supabase Dashboard -> **Auth** -> **URL Configuration**.
- [ ] **Email SMTP Configuration**: For production, disable the default Supabase SMTP rate limit limits and configure your institutional custom SMTP server to send verification links.
