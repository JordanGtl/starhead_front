# Star-Head — Front (Next.js 14)

Interface web du projet Star-Head. Construite avec **Next.js 14** (App Router), **React 18**, **TailwindCSS** et **shadcn/ui**.

---

## Prérequis

- Node.js 20+
- npm

---

## Installation

```bash
cd Front
npm install
cp .env.local.example .env.local  # adapter NEXT_PUBLIC_API_URL
```

---

## Développement

```bash
npm run dev
# → http://localhost:3000
```

---

## Docker

| Environnement | Fichier | Projet Docker | Port |
|---|---|---|---|
| Recette (staging) | `docker-compose.staging.yml` | `starhead-front-staging` | `11100` |
| Production | `docker-compose.prod.yml` | `starhead-front-prod` | `11200` |

### Recette

```bash
docker compose -f docker-compose.staging.yml up -d --build
```

- Build depuis les sources à chaque démarrage
- `NEXT_PUBLIC_API_URL` pointe vers `https://staging-api.star-head.sc` par défaut
- `restart: unless-stopped`

Variables optionnelles (`.env.staging`) :

```env
NEXT_PUBLIC_API_URL=https://staging-api.star-head.sc
NEXT_PUBLIC_SITE_URL=https://staging.star-head.sc
```

### Production

```bash
./prod.sh 1.0.0
```

Le script `prod.sh` gère le build de l'image, le tag et le déploiement en une commande.

```
Usage : ./prod.sh [IMAGE_TAG]

  IMAGE_TAG   Tag de l'image Docker à builder et déployer (défaut : latest)

Exemples :
  ./prod.sh          # tag = latest
  ./prod.sh 1.2.0    # tag = 1.2.0
```

Le script :
1. Build l'image Docker `starhead-front:<tag>`
2. Arrête le conteneur en cours
3. Démarre le nouveau conteneur avec l'image buildée

Variables requises (`.env.prod`) :

```env
NEXT_PUBLIC_API_URL=https://api.star-head.sc
NEXT_PUBLIC_SITE_URL=https://star-head.sc
IMAGE_TAG=1.0.0
```

### Commandes utiles

```bash
# Consulter les logs
docker compose -f docker-compose.prod.yml logs -f front

# Accéder au conteneur
docker compose -f docker-compose.prod.yml exec front sh

# Arrêter
docker compose -f docker-compose.prod.yml down
```

---

## Structure

```
app/                  # Pages Next.js (App Router)
src/
├── components/       # Composants React
│   └── ui/           # Composants shadcn/ui
├── contexts/         # Contextes React (Auth, Version)
├── hooks/            # Hooks personnalisés
├── lib/              # Utilitaires, client API
├── i18n/             # Internationalisation (i18next)
└── views/            # Pages (importées dans app/**/page.tsx)
public/               # Assets statiques
```

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API Symfony | `https://api.star-head.sc` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | `https://star-head.sc` |
