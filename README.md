# matchupcoachfrontend (Lovable template)

This repository is the standalone Vite + React + TypeScript frontend template created with Lovable. It contains the full UI for the MatchupCoach experience and is intended to be developed independently from the Laravel backend, then built and published into the Laravel app for production.

Quick status
- Stack: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query
- Dev server: vite (default port 5173)
- Entry: `src/main.tsx` → `src/App.tsx`

Branches & deploy
- `production` — merging a PR here triggers the real production deploy on Vercel (`www.matchupgg.com`). Protected: PR + passing CI required, no direct pushes.
- `staging` — integration branch; every push gets a Vercel preview deployment. Protected the same way as `production`.
- `main` — default branch, kept as a live mirror/backup of `production` via an automated workflow (`.github/workflows/sync-main.yml`) that fast-forwards it after every production merge. Not meant to receive direct commits.
- CI (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `eslint`, and `npm run build` on every PR and on pushes to the three branches above.

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

Bot protection (Google reCAPTCHA v3)
- The champion-selection form runs an invisible reCAPTCHA v3 check before calling `/api/analyze`. It's free and requires no user interaction — no checkbox, no visible widget (Google's floating badge is hidden via CSS in `src/index.css` and replaced by the required disclosure text under the "Generate Plan" button, per Google's terms).
- Frontend setup: create a free Site Key at https://www.google.com/recaptcha/admin/create (choose reCAPTCHA v3, add your domain(s) + `localhost`), then set `VITE_RECAPTCHA_SITE_KEY` in `.env`. The Site Key is public/safe to expose. See `src/lib/recaptcha.ts` for the token helper — when the key is unset, verification is skipped (with a console warning in dev) instead of blocking the app.
- Backend requirement (Laravel, not in this repo): the frontend now sends `recaptchaToken` in the JSON body of `POST /api/analyze`. The token must be verified server-side with the Secret Key (never exposed to the frontend) before proceeding, e.g.:

	```php
	$response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
		'secret' => config('services.recaptcha.secret'), // RECAPTCHA_SECRET_KEY in Laravel's .env
		'response' => $request->input('recaptchaToken'),
		'remoteip' => $request->ip(),
	]);

	$result = $response->json();
	if (!($result['success'] ?? false) || ($result['score'] ?? 0) < 0.5) {
		abort(403, 'Falha na verificação reCAPTCHA');
	}
	```

	Until this backend check is added, the token is sent but not enforced — add it to actually block bots.

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
