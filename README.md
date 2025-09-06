
# EcoFinds – MVP (Problem Statement 1)

This repo contains a ready-to-run MVP for **EcoFinds**, covering the hackathon requirements:
- Auth (register/login), basic profile (username), user dashboard (editable fields)
- Product CRUD (title, description, category, price, image placeholder)
- Browsing feed with category filter, title keyword search, and product details
- Cart with checkout
- Previous purchases listing
- Responsive web app (desktop + mobile friendly)

## Prerequisites
- Node.js 18+ and npm

## Run Backend (API)
```bash
cd server
npm install
npm run dev
```
Server runs on **http://localhost:4000** (set `PORT` to change).

## Run Frontend (Web)
Open a second terminal:
```bash
cd web
npm install
npm run dev
```
Vite dev server runs on **http://localhost:5173** and proxies to API at `http://localhost:4000` (configurable via `VITE_API`).

## Default Categories
Electronics, Fashion, Furniture, Books, Home, Sports, Other.

## Notes
- Image upload is simplified to a URL field; a placeholder is used if empty.
- SQLite database (`server/data.db`) is created automatically.
- JWT secret defaults to `devsecret` for local development.
