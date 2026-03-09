---
name: ConciliAI LS-Sync
description: Systematic process for Lemon Squeezy integration, implementation plan updates, and Git/Vercel synchronization.
---

# ConciliAI LS-Sync: The SaaS Auto-Pilot Skill

Use this skill whenever you modify Lemon Squeezy logic, Pricing, or Tier limits in ConciliAI.

## 1. Plan Verification
Always check the `C:\Users\kevindiaz\.gemini\antigravity\brain\60d0ca68-c435-4fed-9acf-f70c6253a1ba\implementation_plan.md` (or the relative path `IMPLEMENTATION.md` in your project if you move it) before any code change.

## 2. Environment Variables Checklist (Vercel)
If you are deploying to Vercel, you **MUST** add these in the Vercel Dashboard:

- `LEMON_SQUEEZY_API_KEY`
- `LEMON_SQUEEZY_STORE_ID`
- `LEMON_SQUEEZY_VARIANT_ID_PRO`
- `LEMON_SQUEEZY_VARIANT_ID_DESPACHO`
- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL` (Debe ser `https://tu-dominio.vercel.app`)

## 3. Webhook Integration Protocol
The Webhook URL is your Vercel Domain + `/api/lemonsqueezy/webhook`.

## 4. Auto-Sync to GitHub
Use `/git-sync` to start the build in Vercel.
