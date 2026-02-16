<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1N8nAt7DYclV0ya4T9VDe8IC51b-FHW9y

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   - **Supabase:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` from [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api)
   - **Gemini:** `GEMINI_API_KEY` for AI features
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy on Vercel

1. Push your repo to GitHub (or connect Vercel to your Git provider).
2. In [Vercel](https://vercel.com), **New Project** → import this repo.
3. Set **Root Directory** to `Wise-App-Health` (if the app lives in that subfolder).
4. Add **Environment Variables** (Settings → Environment Variables):
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_ANON_KEY` — your Supabase anon/public key
   - `GEMINI_API_KEY` — your Gemini API key (if using AI features)
5. Deploy. Vercel will run `npm run build` and serve the `dist` output.
