# Anjaraipetti — A Pinch of Magic 🌶️

> Tamil Nadu's authentic homemade food store — Masala, Sweets & Snacks

## 🏗️ Architecture

**Monorepo** with two separate apps:

| App       | Tech Stack                  | Deployment |
|-----------|----------------------------|------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS 4, Zustand | Vercel |
| Backend   | Node.js, Express.js, Prisma, PostgreSQL | Render.com |

## 📁 Project Structure

```
anjaraipetti/
├── frontend/         # Next.js storefront + admin panel
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # API, Firebase, Razorpay, validations
│   │   ├── store/        # Zustand stores (cart, auth, language)
│   │   └── types/        # TypeScript interfaces
│   └── vercel.json
├── backend/          # Express.js REST API
│   ├── prisma/           # Schema + seed data
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── middleware/    # Auth, validation, security, rate-limit
│       ├── routes/        # API route definitions
│       ├── services/      # Razorpay, Cloudinary, Audit
│       ├── validations/   # Zod schemas
│       └── lib/           # Prisma, Firebase Admin
├── render.yaml
└── package.json      # Root monorepo scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Firebase project (for phone auth)
- Razorpay account
- Cloudinary account

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Push database schema
npm run db:push

# Seed the database
npm run db:seed

# Run both apps
npm run dev
```

### Environment Variables

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

#### Backend (`.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/anjaraipetti
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FRONTEND_URL=http://localhost:3000
SENTRY_DSN=
```

## 🎨 Features

### Customer Storefront
- 🏠 **Home** — Hero banner, categories, best sellers, offers, trust badges
- 📂 **Category pages** — Masala, Sweets, Snacks with product grids
- 🛍️ **Product detail** — Image gallery, pricing, add to cart
- 🛒 **Cart** — Full-page cart with delivery progress bar
- 💳 **Checkout** — 3-step: Phone → Address → Payment (Razorpay / COD)
- ✅ **Order success** — Confirmation with order number
- 📋 **Order history** — Track all past orders
- 🌐 **Bilingual** — English ↔ Tamil toggle
- 📱 **Responsive** — Mobile-first design

### Admin Panel (`/admin`)
- 🔐 **Login** — JWT-based admin authentication
- 📊 **Dashboard** — Revenue, orders, customers, products at a glance
- 📦 **Products CRUD** — Create, edit, deactivate with image management
- 📋 **Orders** — View all orders, filter by status, update status inline
- 👥 **Customers** — Customer list with order counts

### Security
- 🔒 Helmet, CORS whitelist, HPP protection
- 🚫 Rate limiting (global, auth, payment)
- 🔐 Firebase Admin SDK for customer auth verification
- 🔑 JWT with httpOnly cookies for sessions
- ✅ Server-side price calculation (never trust frontend)
- 🔏 Razorpay webhook signature verification
- 📝 Input validation with Zod on both frontend and backend

## 🔗 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/verify` | — | Firebase token → JWT |
| POST | `/api/auth/admin/login` | — | Admin email/password login |
| POST | `/api/auth/logout` | — | Clear cookies |
| GET  | `/api/auth/me` | User | Get current user |
| GET  | `/api/categories` | — | All categories |
| GET  | `/api/products` | — | All active products (paginated) |
| GET  | `/api/products/featured` | — | Featured products |
| GET  | `/api/products/category/:slug` | — | By category |
| GET  | `/api/products/:id` | — | Single product |
| POST | `/api/orders` | User | Create order |
| GET  | `/api/orders/my` | User | User's orders |
| GET  | `/api/orders/:id` | User | Order detail |
| POST | `/api/payment/create-order` | User | Create Razorpay order |
| POST | `/api/payment/verify` | User | Verify payment |
| POST | `/api/payment/webhook` | — | Razorpay webhook |
| POST | `/api/upload/image` | Admin | Upload to Cloudinary |
| DELETE| `/api/upload/image` | Admin | Delete from Cloudinary |
| GET  | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET  | `/api/admin/products` | Admin | All products |
| POST | `/api/admin/products` | Admin | Create product |
| PUT  | `/api/admin/products/:id` | Admin | Update product |
| DELETE| `/api/admin/products/:id` | Admin | Deactivate product |
| GET  | `/api/admin/orders` | Admin | All orders |
| GET  | `/api/admin/orders/:id` | Admin | Order detail |
| PUT  | `/api/admin/orders/:id/status` | Admin | Update status |
| GET  | `/api/admin/customers` | Admin | All customers |
| GET  | `/api/admin/audit-logs` | Admin | Audit trail |

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#8B1A1A` | Deep maroon — CTA buttons, accents |
| Secondary | `#C8962E` | Gold — badges, highlights |
| Cream | `#FDF6EC` | Background |
| Brown | `#2C1810` | Text, navbar |
| Heading Font | Playfair Display | Titles, headings |
| Body Font | Lato | Paragraphs, labels |
| Tamil Font | Noto Sans Tamil | Tamil text |

## 📄 License

© 2026 Anjaraipetti. All rights reserved.
