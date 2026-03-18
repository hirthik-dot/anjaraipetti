Build a complete, MNC-grade production e-commerce application called 
"Anjaraipetti - A Pinch of Magic" — a Tamil Nadu homemade food store 
selling Masala, Sweets, and Snacks.

Architecture: Monorepo with two separate apps:
- /frontend → Next.js 14 (deployed to Vercel)
- /backend  → Node.js + Express.js (deployed to Render.com)

═══════════════════════════════════════════════════
📁 MONOREPO STRUCTURE
═══════════════════════════════════════════════════

anjaraipetti/
├── frontend/                          ← Next.js App (Vercel)
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── page.tsx               ← Home
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── order-success/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── products/[id]/edit/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── orders/[id]/page.tsx
│   │   │   └── customers/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageToggle.tsx
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── BestSellers.tsx
│   │   │   ├── OfferBanner.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductImageGallery.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartItem.tsx
│   │   ├── checkout/
│   │   │   ├── AddressForm.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── PaymentOptions.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── ProductForm.tsx
│   │       ├── OrderTable.tsx
│   │       └── DashboardStats.tsx
│   ├── lib/
│   │   ├── api.ts                     ← axios instance pointing to backend
│   │   ├── firebase.ts                ← Firebase Phone Auth setup
│   │   ├── razorpay.ts                ← Razorpay frontend helper
│   │   └── validations.ts             ← Zod schemas (frontend)
│   ├── store/
│   │   ├── cartStore.ts               ← Zustand cart (persisted)
│   │   ├── authStore.ts               ← Zustand user session
│   │   └── languageStore.ts           ← Tamil/English toggle
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useLanguage.ts
│   ├── types/
│   │   └── index.ts
│   ├── public/
│   │   └── anjaraipetti-logo.png
│   ├── middleware.ts                  ← Protect /admin routes
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.local.example
│   └── package.json
│
├── backend/                           ← Express.js App (Render)
│   ├── src/
│   │   ├── server.ts                  ← Entry point
│   │   ├── app.ts                     ← Express app setup
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     ← Verify Firebase token + admin JWT
│   │   │   ├── rateLimit.middleware.ts← express-rate-limit
│   │   │   ├── validate.middleware.ts ← Zod validation
│   │   │   ├── security.middleware.ts ← helmet, cors, hpp
│   │   │   └── errorHandler.middleware.ts
│   │   ├── services/
│   │   │   ├── razorpay.service.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   └── audit.service.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── firebase-admin.ts      ← Verify Firebase tokens server-side
│   │   └── validations/
│   │       ├── auth.validation.ts
│   │       ├── product.validation.ts
│   │       └── order.validation.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                       ← Root package.json (monorepo scripts)

═══════════════════════════════════════════════════
🛠️ TECH STACK
═══════════════════════════════════════════════════

Frontend (Vercel):
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (cart + auth + language state)
- Firebase Client SDK (Phone Auth OTP)
- Axios (API calls to backend)
- Razorpay client-side SDK
- Zod (form validation)

Backend (Render):
- Node.js + Express.js + TypeScript
- Prisma ORM + PostgreSQL (Supabase)
- Firebase Admin SDK (verify OTP tokens)
- Razorpay Node SDK
- Cloudinary Node SDK
- bcryptjs (admin password)
- jsonwebtoken (admin sessions)
- helmet (security headers)
- cors (whitelist frontend domain only)
- express-rate-limit (rate limiting)
- hpp (HTTP parameter pollution prevention)
- express-mongo-sanitize (NoSQL injection)
- Zod (request validation)
- Sentry (error tracking)
- multer (file upload handling)

═══════════════════════════════════════════════════
🗄️ DATABASE SCHEMA (in backend/prisma/schema.prisma)
═══════════════════════════════════════════════════

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String    @id @default(cuid())
  name        String
  phone       String    @unique
  email       String?
  firebaseUid String    @unique
  addresses   Address[]
  orders      Order[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Address {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  line1     String
  line2     String?
  city      String
  state     String
  pincode   String
  isDefault Boolean @default(false)
}

model Admin {
  id           String     @id @default(cuid())
  email        String     @unique
  passwordHash String
  name         String
  auditLogs    AuditLog[]
  createdAt    DateTime   @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  nameTa   String
  slug     String    @unique
  image    String
  products Product[]
}

model Product {
  id          String      @id @default(cuid())
  name        String
  nameTa      String
  description String
  descTa      String
  price       Float
  mrp         Float
  stock       Int         @default(0)
  images      String[]
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  isActive    Boolean     @default(true)
  isFeatured  Boolean     @default(false)
  weight      String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique
  userId            String
  user              User        @relation(fields: [userId], references: [id])
  items             OrderItem[]
  subtotal          Float
  deliveryCharge    Float       @default(0)
  total             Float
  paymentMode       PaymentMode
  paymentStatus     PaymentStatus @default(PENDING)
  orderStatus       OrderStatus   @default(PLACED)
  address           Json
  razorpayOrderId   String?
  razorpayPaymentId String?
  razorpaySignature String?
  notes             String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  name      String
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String
  entity    String
  entityId  String
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id])
  details   Json
  createdAt DateTime @default(now())
}

enum PaymentMode {
  RAZORPAY
  COD
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum OrderStatus {
  PLACED
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

═══════════════════════════════════════════════════
🔐 AUTH FLOW (Firebase Phone Auth)
═══════════════════════════════════════════════════

Customer Login Flow:
1. User enters phone number at checkout
2. Firebase sends OTP to phone (client-side)
3. User enters OTP → Firebase returns idToken
4. Frontend sends idToken to backend: POST /api/auth/verify
5. Backend verifies idToken using Firebase Admin SDK
6. Backend checks if user exists in DB by firebaseUid
   → If yes: return existing user + JWT session
   → If no: create new user, return JWT session
7. JWT stored in httpOnly cookie
8. User can now place orders + view history

Admin Login Flow:
1. Admin enters email + password at /admin/login
2. POST /api/auth/admin/login
3. Backend: find admin by email, bcrypt.compare password
4. If valid: sign JWT with role: "admin", 8hr expiry
5. Store in httpOnly cookie
6. All /admin/* API routes check for admin JWT

═══════════════════════════════════════════════════
💳 PAYMENT FLOW (Razorpay — Production Grade)
═══════════════════════════════════════════════════

Online Payment:
1. User clicks "Pay Online"
2. Frontend: POST /api/payment/create-order
   → Backend recalculates total from DB (never trust frontend amount)
   → Creates Razorpay order with exact server amount
   → Returns { razorpayOrderId, amount, currency }
3. Frontend opens Razorpay modal with returned order details
4. User pays via UPI / Card / Net banking
5. Razorpay calls our webhook: POST /api/payment/webhook
   → Backend verifies X-Razorpay-Signature using crypto.timingSafeEqual
   → Only if valid: update order paymentStatus to PAID
6. Frontend also receives success callback
   → Frontend calls POST /api/payment/verify with payment details
   → Backend double-verifies signature
   → Redirects to /order-success

COD Flow:
1. User selects COD
2. Phone must be verified (Firebase OTP already done at checkout start)
3. POST /api/orders with paymentMode: COD
4. Order created with paymentStatus: PENDING, orderStatus: PLACED
5. Admin sees order in dashboard

CRITICAL SECURITY RULES:
- Amount ALWAYS calculated server-side
- Webhook signature ALWAYS verified before marking paid
- Use crypto.timingSafeEqual (not ===) for signature comparison
- Razorpay secret NEVER sent to frontend
- Order only marked PAID after BOTH webhook + verify confirm

═══════════════════════════════════════════════════
🔒 BACKEND SECURITY (implement ALL)
═══════════════════════════════════════════════════

In app.ts setup these in order:

1. helmet() — sets all security headers automatically
2. cors({ origin: process.env.FRONTEND_URL, credentials: true })
3. express.json({ limit: '10kb' }) — prevent large payload attacks
4. hpp() — HTTP parameter pollution prevention
5. express-rate-limit:
   - Global: 100 req per 15 min per IP
   - Auth routes: 5 req per 15 min per IP
   - Payment routes: 10 req per 15 min per IP
6. All inputs validated with Zod before reaching controller
7. Never expose stack traces in production errors
8. All passwords: bcrypt saltRounds: 12
9. JWT: RS256 algorithm, 8hr expiry for admin
10. Razorpay webhook: raw body parser (not JSON) for signature verification
11. Sentry error tracking initialized at top of app

Error response format (never expose internals):
{
  success: false,
  message: "Human readable message",
  code: "ERROR_CODE"
  // NO stack trace in production
}

═══════════════════════════════════════════════════
🎨 FRONTEND DESIGN
═══════════════════════════════════════════════════

Brand Colors (use as CSS variables):
--color-primary: #8B1A1A      (deep red)
--color-secondary: #C8962E    (gold)
--color-cream: #FDF6EC        (background)
--color-brown: #2C1810        (dark text)
--color-light: #FFF8F0        (card background)

Fonts (load from Google Fonts):
- Playfair Display → headings
- Lato → body text
- Noto Sans Tamil → Tamil text

Home Page sections (build all):
1. Sticky Navbar: logo + nav + cart badge + language toggle (EN/தமிழ்)
2. Hero: full-width banner, Tamil + English text, "Shop Now" CTA
3. Trust badges: Homemade | No Preservatives | Free Delivery ₹499+ | Secure Pay
4. Category Grid: 3 cards — Masala / Sweets / Snacks (Tamil + English)
5. Best Sellers: product grid with Add to Cart
6. Offer Banner: "10% OFF first order — MAGIC10"
7. Why Choose Us: 4 feature cards
8. Footer: logo, links, social, payment icons

Product Card must show:
- Product image
- Name (English + Tamil based on toggle)
- Price + MRP strikethrough + discount %
- Add to Cart button
- Out of stock state

Cart Drawer (slides from right):
- List of items with quantity controls
- Subtotal
- Free delivery progress bar (e.g. "Add ₹150 more for free delivery")
- Checkout button

Checkout Page (single page, 3 steps):
Step 1: Phone number → Firebase OTP → verified
Step 2: Name + Email + Address (prefilled if returning user)
Step 3: Order summary + Payment choice (Razorpay / COD)

Admin Panel design:
- Clean sidebar layout
- Dark sidebar (#2C1810) with gold (#C8962E) active states
- Data tables with sort + filter
- Image upload with preview
- Status badges (color coded)
- Mobile responsive

Language Toggle:
- Store preference in localStorage
- All product names, descriptions, categories show in selected language
- UI labels: maintain a translations object in /lib/translations.ts

═══════════════════════════════════════════════════
📦 SEED DATA (backend/prisma/seed.ts)
═══════════════════════════════════════════════════

Categories:
1. { name: "Masala", nameTa: "மசாலா", slug: "masala" }
2. { name: "Sweets", nameTa: "இனிப்புகள்", slug: "sweets" }
3. { name: "Snacks", nameTa: "தின்பண்டங்கள்", slug: "snacks" }

Products (3 per category, all with Tamil names + descriptions):
Masala:
- Sambar Powder / சாம்பார் பொடி — ₹120, MRP ₹150, 200g
- Rasam Powder / ரசம் பொடி — ₹100, MRP ₹130, 200g
- Chicken Masala / சிக்கன் மசாலா — ₹150, MRP ₹180, 200g
- Chilli Powder / மிளகாய் பொடி — ₹90, MRP ₹110, 200g
- Coriander Powder / கொத்தமல்லி பொடி — ₹80, MRP ₹100, 200g
- Garam Masala / கரம் மசாலா — ₹130, MRP ₹160, 200g

Sweets:
- Mysore Pak / மைசூர் பாக் — ₹250, MRP ₹300, 250g
- Adhirasam / அதிரசம் — ₹200, MRP ₹250, 250g
- Kaju Katli / காஜு கட்லி — ₹350, MRP ₹400, 250g
- Ladoo / லட்டு — ₹180, MRP ₹220, 250g

Snacks:
- Murukku / முறுக்கு — ₹150, MRP ₹180, 300g
- Mixture / மிக்ஸ்சர் — ₹130, MRP ₹160, 300g
- Thattai / தட்டை — ₹140, MRP ₹170, 300g
- Banana Chips / வாழைப்பழ சிப்ஸ் — ₹120, MRP ₹150, 250g
- Ribbon Pakoda / ரிப்பன் பகோடா — ₹110, MRP ₹140, 250g

Admin seed:
- email: admin@anjaraipetti.com
- password: Admin@123 (hashed bcrypt 12 rounds)
- name: Admin

═══════════════════════════════════════════════════
🌐 API ROUTES (backend)
═══════════════════════════════════════════════════

Auth:
POST   /api/auth/verify              ← Firebase token → create/login user
POST   /api/auth/admin/login         ← Admin email/password login
POST   /api/auth/logout              ← Clear cookie
GET    /api/auth/me                  ← Get current user

Products:
GET    /api/products                 ← All active products (with filters)
GET    /api/products/featured        ← Featured products
GET    /api/products/:id             ← Single product
GET    /api/products/category/:slug  ← Products by category

Categories:
GET    /api/categories               ← All categories

Orders:
POST   /api/orders                   ← Create order (auth required)
GET    /api/orders/my                ← User's order history (auth required)
GET    /api/orders/:id               ← Single order detail (auth required)

Payment:
POST   /api/payment/create-order     ← Create Razorpay order (auth required)
POST   /api/payment/verify           ← Verify payment signature
POST   /api/payment/webhook          ← Razorpay webhook (raw body, no auth)

Upload:
POST   /api/upload/image             ← Upload to Cloudinary (admin only)
DELETE /api/upload/image             ← Delete from Cloudinary (admin only)

Admin (all require admin JWT):
GET    /api/admin/dashboard          ← Stats + recent orders
GET    /api/admin/products           ← All products
POST   /api/admin/products           ← Create product
PUT    /api/admin/products/:id       ← Update product
DELETE /api/admin/products/:id       ← Delete product
GET    /api/admin/orders             ← All orders with filters
GET    /api/admin/orders/:id         ← Order detail
PUT    /api/admin/orders/:id/status  ← Update order status
GET    /api/admin/customers          ← All customers
GET    /api/admin/audit-logs         ← Audit trail

═══════════════════════════════════════════════════
🚀 DEPLOYMENT CONFIG
═══════════════════════════════════════════════════

Frontend (Vercel):
Create frontend/vercel.json:
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://anjaraipetti-api.onrender.com",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID": "@razorpay_key_id",
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id"
  }
}

Backend (Render):
Create backend/render.yaml:
services:
  - type: web
    name: anjaraipetti-api
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_SECRET
        sync: false
      - key: CLOUDINARY_URL
        sync: false
      - key: FIREBASE_PROJECT_ID
        sync: false
      - key: FIREBASE_PRIVATE_KEY
        sync: false
      - key: FIREBASE_CLIENT_EMAIL
        sync: false
      - key: FRONTEND_URL
        sync: false
      - key: SENTRY_DSN
        sync: false

Root package.json scripts:
{
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "db:push": "cd backend && npx prisma db push",
    "db:seed": "cd backend && npx prisma db seed"
  }
}

═══════════════════════════════════════════════════
📋 ENV FILES
═══════════════════════════════════════════════════

frontend/.env.local.example:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

backend/.env.example:
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/anjaraipetti?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_min_64_chars
JWT_EXPIRY=8h
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:3000
SENTRY_DSN=your_sentry_dsn

═══════════════════════════════════════════════════
📖 README.md (generate complete one with)
═══════════════════════════════════════════════════
- Project overview + logo
- Architecture diagram
- Tech stack
- Local setup (step by step)
- All environment variables explained
- Supabase setup guide
- Firebase setup guide
- Razorpay setup guide
- Cloudinary setup guide
- Deploy frontend to Vercel (step by step)
- Deploy backend to Render (step by step)
- Admin panel guide
- API documentation
- Security notes

═══════════════════════════════════════════════════
✅ FINAL CHECKLIST — verify everything works
═══════════════════════════════════════════════════
□ Both frontend and backend run locally with npm run dev
□ DB schema pushed to Supabase + seeded
□ Home page: all sections render with real seeded data
□ Category pages filter correctly
□ Product detail page shows full info
□ Cart persists on page refresh
□ New user checkout: OTP → address → pay
□ Returning user: phone recognized → address prefilled
□ Razorpay test mode payment completes end to end
□ Webhook marks order as PAID correctly
□ COD order placed successfully
□ Order success page shows order number
□ Order history shows past orders
□ Admin login works
□ Admin dashboard shows real stats
□ Admin can create product with image upload
□ Admin can edit/delete products
□ Admin can update order status
□ All API routes reject invalid input (Zod)
□ Rate limiting blocks after threshold
□ CORS blocks requests from unknown origins
□ Security headers present on all responses
□ No secrets exposed in frontend bundle
□ Tamil/English toggle works on all pages
□ Mobile responsive on all pages
□ vercel.json and render.yaml ready for deployment
□ .env.example files complete
□ README.md fully written

Build every single file completely. 
No placeholders. No TODOs. No "implement this later". 
Production-ready code throughout.