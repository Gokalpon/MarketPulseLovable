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

## LLM / AI integration (safe defaults)

 - **Default state:** Remote LLM calls are disabled by default for safety and cost control.
 - **Config:** See `.env.sample` for recommended environment variables and safe defaults.
 - **How it works:** The app uses a local summarizer and persistent cache when the LLM is not enabled. Remote LLM requests are only made when an explicit endpoint is configured and defined gating thresholds are exceeded (price movement or comment activity).
 - **To disable remote LLM in production:** Leave `VITE_ENABLE_LLM` unset or set it to `false` in your environment.

Files added: `.env.sample` (root) — copy into `.env` or configure your deployment environment variables accordingly.

## Recent UI changes (implemented)

- **User comment markers:** User's own comments are now rendered as solid purple markers on charts for clear identification. (See `src/components/market/MarketPulseApp.tsx`)
- **Donut sentiment gauge:** Positive and negative segments now use smooth gradients for a premium look; neutral segment uses a clean white stroke for readability. (See `src/components/market/MarketPulseApp.tsx`)
- **Bottom navigation:** Button spacing and proportions improved (`flex-1`), and the active nav dot cycles between green, blue and white for better visual signature. (See `src/components/market/MarketPulseApp.tsx`)
- **Color tokens & badges:** Positive badges use the green→blue signature gradient, negative badges now use a subtle red gradient, and neutral badges in comment lists use white for contrast. (See `src/index.css` and `src/components/market/MarketPulseApp.tsx`)

These changes were implemented to match the visual guidance provided and improve clarity and premium feel.
