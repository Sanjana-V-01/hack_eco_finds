
# EcoFinds Server

## Setup
```bash
cd server
npm install
npm run dev
```
Default port: `4000`. Set `JWT_SECRET` if desired.

## API Summary
- `POST /api/auth/register { email, password, username } -> { token }`
- `POST /api/auth/login { email, password } -> { token }`
- `GET /api/users/me` (auth) -> profile
- `PUT /api/users/me { username }` (auth) -> updated profile
- `GET /api/users/categories` -> list of categories
- `GET /api/products?category=&q=` -> list products (title-only search)
- `GET /api/products/:id` -> product detail
- `POST /api/products` (auth) -> create
- `PUT /api/products/:id` (auth, owner) -> update
- `DELETE /api/products/:id` (auth, owner) -> delete
- `GET /api/products/me/listings/all` (auth) -> my listings
- `GET /api/cart` (auth) -> items
- `POST /api/cart/add { productId, qty }` (auth)
- `POST /api/cart/remove { productId }` (auth)
- `POST /api/cart/checkout` (auth) -> creates order
- `GET /api/orders` (auth) -> previous purchases
