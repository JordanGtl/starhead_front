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

## Conventions de développement

### En-tête de page (`PageHeader`)

Toutes les pages de détail **doivent utiliser le composant `PageHeader`** situé dans `src/components/PageHeader.tsx`.

Ce composant gère :
- Le **breadcrumb** sticky collé sous la navbar (fond `bg-card/90`, `backdrop-blur`)
- Le **hero pleine largeur** avec l'image de fond `hero-bg.jpg`, le gradient et le titre

#### Utilisation

```tsx
import PageHeader from "@/components/PageHeader";
import { MyIcon } from "lucide-react";

<PageHeader
  breadcrumb={[
    { label: "Section", href: "/section", icon: MyIcon },
    { label: "Sous-section", href: "/section?filter=foo" },
    { label: "Titre de la page courante" },   // dernier élément = page courante (pas de lien)
  ]}
  title="Titre principal"
  label="Libellé au-dessus du titre"          // optionnel
  labelIcon={MyIcon}                          // optionnel
  subtitle="Sous-titre ou métadonnées"        // optionnel
/>
```

#### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `breadcrumb` | `BreadcrumbItem[]` | ✅ | Fil d'ariane. Le dernier item est la page courante (sans `href`). |
| `title` | `string` | ✅ | Titre h1 affiché dans le hero. |
| `label` | `string` | — | Libellé en petit texte au-dessus du titre (ex: type, catégorie). |
| `labelIcon` | `React.ElementType` | — | Icône Lucide affichée à gauche du label. |
| `subtitle` | `string` | — | Sous-titre affiché sous le titre (ex: fabricant, rôle). |

---

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
