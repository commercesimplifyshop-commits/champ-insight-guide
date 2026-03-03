# matchupcoachfrontend (Lovable template)

This repository is the standalone Vite + React + TypeScript frontend template created with Lovable. It contains the full UI for the MatchupCoach experience and is intended to be developed independently from the Laravel backend, then built and published into the Laravel app for production.

Quick status
- Stack: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query
- Dev server: vite (default port 5173)
- Entry: `src/main.tsx` → `src/App.tsx`

Local development

1. Install dependencies

	cd /Users/kaiio.santos/Documents/workspace/matchupcoachfrontend
	npm ci

2. Run dev server (exposes HMR)

	npm run dev -- --host 0.0.0.0 --port 5173

3. Open the app in the browser:

	http://localhost:5173

Notes for working with the Laravel backend during dev
- If the Laravel backend runs in Docker and the frontend runs on the host, use `host.docker.internal` to reach the API from the frontend.
- Set the API base for the frontend via environment (Vite env):

	# in .env or .env.local
	VITE_API_BASE=http://host.docker.internal:8000

- If you want Laravel's Blade to load the dev server automatically when you visit the Laravel URL, ensure `APP_ENV=local` in the Laravel `.env` and the `resources/views/spa.blade.php` of the Laravel app contains the dev-server branch.

Build for production (to integrate with Laravel)

1. Build the frontend:

	npm run build

2. Copy the build output into the Laravel project so Blade can serve it. Example (adjust paths if your build output folder differs):

	# remove old build
	rm -rf /Users/kaiio.santos/Documents/workspace/matchupcoach/public/build/*

	# copy new assets (example when output is `dist` or `build`)
	cp -R /Users/kaiio.santos/Documents/workspace/matchupcoachfrontend/dist/* /Users/kaiio.santos/Documents/workspace/matchupcoach/public/build/

3. Verify `public/build/manifest.json` exists in the Laravel project and deploy/restart.

Deployment recommendations
- Preferred production flow: build in CI (GitHub Actions) and copy artifacts into the Laravel repo (public/build) as part of the deploy pipeline. This avoids running Node on the VPS.
- Alternatively you may containerize the frontend and serve via Nginx/Traefik as a separate service and proxy traffic appropriately.

Important env/port/HMR tips
- Use `--host 0.0.0.0` when running inside Docker to accept external connections.
- If HMR websocket fails behind Docker, set Vite's HMR host to `host.docker.internal` or configure `server.hmr.clientPort`.

Useful commands
- Install deps: `npm ci`
- Dev: `npm run dev -- --host 0.0.0.0 --port 5173`
- Build: `npm run build`
- Preview build: `npm run preview`

Contact / notes
- This repo is used as the canonical UI template. For production integration with the Laravel app, build and copy files into the Laravel `public/build` (manifest required).

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
