# Supabase Setup Guide for AutoBlog

## Prerequisites

- Supabase account: https://supabase.com
- Vercel account connected to your GitHub

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Set project name: `autoblog-production`
5. Set database password (save it!)
6. Choose region (closest to your users)
7. Click "Create new project"

## Step 2: Setup Database Schema

1. In your Supabase project, go to "SQL Editor"
2. Copy the entire contents of `supabase_schema.sql`
3. Paste it in the SQL Editor
4. Click "Run" to execute the schema

## Step 3: Get Database URL

1. In Supabase, go to "Settings" > "Database"
2. Find "Connection string" section
3. Copy the "URI" connection string
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 4: Configure Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your `autoblog` project
3. Go to "Settings" > "Environment Variables"
4. Add these variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_SECRET=your-secure-random-string-min-32-chars
NEXTAUTH_URL=https://autoblog-beta.vercel.app
NODE_ENV=production
```

## Step 5: Redeploy

1. Go to "Deployments" tab in Vercel
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger deployment

## Step 6: Test

1. Visit https://autoblog-beta.vercel.app
2. Try to register a new user
3. Check Supabase "Table Editor" to see if user was created

## Environment Variables Details

### DATABASE_URL

Replace `[YOUR-PASSWORD]` and `[PROJECT-REF]` with your actual values from Supabase.

### NEXTAUTH_SECRET

Generate a secure random string with:

```bash
openssl rand -base64 32
```

### NEXTAUTH_URL

Your production Vercel URL: `https://autoblog-beta.vercel.app`
