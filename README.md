
# MysteryVlog — Starter

This is a minimal React (Vite) project ready for GitHub → Vercel → domain.

## How to run locally
1) Install Node.js (LTS).
2) In a terminal:
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Deploy to Vercel
1) Push this folder to a GitHub repo.
2) In Vercel: New Project → Import the repo → Framework: "Vite".
3) After deploy, add your domain in Vercel (optional).

## Optional YouTube API
If you have a YouTube Data API key, enable dynamic metadata by setting:
```html
<!-- in index.html -->
<script>
  window.YT_API_KEY = "YOUR_KEY";
</script>
```
