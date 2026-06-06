# SIMPAI Vercel Production Deployment Guide

This guide describes how to deploy the SIMPAI frontend and backend API to Vercel and hook it up to a production database.

## 1. Prerequisites

* A GitHub repository containing the SIMPAI codebase.
* A Vercel Account (Hobby or Pro).
* A Supabase production project with the database schema initialized.

## 2. Step 1: Create a Vercel Project

1. Log into your **Vercel Dashboard**.
2. Click **Add New** -> **Project**.
3. Import your SIMPAI repository from GitHub.

## 3. Step 2: Configure Build Settings

Vercel automatically detects Next.js. Verify the following parameters:

* **Framework Preset**: `Next.js`
* **Root Directory**: `./`
* **Build Command**: `next build` (or `npm run build`)
* **Output Directory**: `.next`

## 4. Step 3: Set Environment Variables

Scroll down to the **Environment Variables** panel and add the following keys from your `.env.local` or `.env.example`:

| Key | Value Source | Required |
|-----|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard -> Settings -> API -> Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard -> Settings -> API -> `anon` public key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel production URL (e.g. `https://simpai.vercel.app`) | Yes |
| `OPENROUTER_API_KEY` | OpenRouter credentials | Yes |
| `DEEPSEEK_API_KEY` | DeepSeek API key | Optional |
| `GEMINI_API_KEY` | Gemini API key | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |

*Note: Make sure not to include trailing slashes on URL values.*

## 5. Step 4: Deploy and Verify

1. Click **Deploy**. Vercel will clone the repository, run the Turbopack compiler, compile pages, and optimize assets.
2. Once the build succeeds, click on the preview window to open the live site.
3. Test public routes (`/login`, `/register`).
4. Log in and verify that cookies are successfully set and dashboard routes load.

## 6. Step 5: Configure Custom Domains (Optional)

1. In the Vercel project, go to **Settings** -> **Domains**.
2. Type in your custom domain (e.g., `simpai.kemdikbud.go.id` or `simpai.ac.id`).
3. Vercel will generate DNS configuration details (CNAME/A records).
4. Update your domain registrar with the provided record types and values. Vercel will automatically provision a free SSL certificate.
