# Chef AI

Full-stack app that turns pantry ingredients into recipes.

- Frontend: `Next.js` (`recipeaifront`)
- Backend: `Strapi` (`backend`)
- AI: `Google Gemini`

## Core Features
- Auth with Clerk
- Pantry item management
- Image-based pantry scan
- AI recipe generation
- Save/unsave recipes
- Pantry-based recommendations
- Recipe PDF export

## Tech Stack
- Next.js 16, React 19, Tailwind CSS 4
- Strapi 5, Node.js
- PostgreSQL NeonDB
- Arcjet, Unsplash, TheMealDB

## Setup
```bash
cd recipeaifront && npm install
cd ../backend && npm install
```

Run backend:
```bash
cd backend
npm run develop
```

Run frontend:
```bash
cd recipeaifront
npm run dev
```

App URL: `http://localhost:3000`


## Scripts

Frontend:
```bash
cd recipeaifront
npm run dev
npm run build
npm run start
npm run lint
```

Backend:
```bash
cd backend
npm run develop
npm run build
npm run start
```
