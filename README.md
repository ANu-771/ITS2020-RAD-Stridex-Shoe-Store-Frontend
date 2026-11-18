# STRIDEX — Storefront & Administrative Web Application

<div align="center">

![STRIDEX Footwear]

### *Step Into Your Style*
**A High-Performance, Luxury Footwear E-Commerce Web Platform**  
*Rapid Application Development (RAD) Coursework*

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.5-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vercel](https://img.shields.io/badge/Vercel_Analytics-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📌 Project Overview

**STRIDEX Frontend** is a luxury e-commerce Single Page Application (SPA) designed for modern footwear retail in Sri Lanka. Engineered with **React 19, TypeScript, and Vite**, it combines an intuitive shopping journey for customers with comprehensive back-office operational consoles for store administrators and inventory managers.

The design system incorporates the signature **STRIDEX Light Green and Mint palette** (`#72C98A` / `#F2FAF4` / `#26352D`), paired with the modern **Outfit** heading typography and **Inter** body typeface for clean, accessible visual hierarchy.

---

## 🌐 Deployed Application URLs

| Environment | Service | Clickable URL | Notes |
| :--- | :--- | :--- | :--- |
| **Production** | **Web Storefront (Vercel)** | [https://stridex-shoes.vercel.app](https://stridex-shoes.vercel.app) | Production web storefront |
| **Production** | **Backend API Server (Render)** | [https://stridex-backend-mkkz.onrender.com](https://stridex-backend-mkkz.onrender.com) | Live Node.js Express backend |
| **Local Development** | **Storefront (Vite)** | [http://localhost:5173](http://localhost:5173) | Development HMR server |
| **Local Development** | **Local API Service** | [http://localhost:3000](http://localhost:3000) | Local Express API server |

---

## 🛠️ Technologies & Tools Used

### Core Framework & State Management
- **React 19**: Modern component architecture leveraging concurrent rendering and hooks.
- **TypeScript**: End-to-end type safety with strict compiler flags (`tsc -b`).
- **Vite 8**: Rapid ES modules development server and optimized Rollup production bundler.
- **Redux Toolkit & React-Redux**: Centralized state management for shopping bag, wishlist, and session authentication.
- **React Router DOM (v7)**: Client-side routing with route change scroll restoration.

### Styling & Visual Presentation
- **Tailwind CSS & PostCSS**: Utility-first responsive design system with customized CSS variables.
- **Outfit & Inter Typography**: Google Fonts integration (`font-outfit` for headings, `font-sans` for high legibility body copy).
- **Lucide React**: Clean, accessible vector icons standardized across all administrative and storefront views.
- **Hardware-Accelerated Marquee**: Infinite smooth scrolling ticker for brand partners.
- **SweetAlert2**: Accessible, themed modal dialogs for order confirmations and alert notifications.

### HTTP Client & Analytics
- **Axios**: Configured client with automatic JWT Bearer token injection, automatic token refresh interceptor, and 50-second cold-start tolerance.
- **@vercel/analytics**: Real-time privacy-compliant visitor analytics without third-party cookies.
- **Recharts**: Responsive SVG charting engine for administrative revenue trends and sales volume analytics.

---

## 🌟 Key Application Features

### 1. Storefront & Homepage Experience
- **Cinematic Hero**: Protective diagonal gradient overlay, high-resolution visual backdrop, and 5-layer infinite video loop engine.
- **Harmonized Brand Marquee**: Showcases all 12 global footwear titans (*Nike, Adidas, Puma, New Balance, DSI Premier, Under Armour, Reebok, Converse, Skechers, Timberland, Columbia, Allbirds*) plus a standardized boutique *Other* category.
- **Dynamic Database-Driven Featured Categories**: Curated collections loaded live from MongoDB with real-time merchandising tags (*Trending, Premium, Popular*).
- **Smooth Deceleration Counters**: Exponential deceleration easing (`easeOutExpo` over 1,800ms) for hero statistics (`500+` Curated Pairs, `100%` Authentic Pairs, `4.9 / 5` Rating).

### 2. Footwear Catalog & 360° Product Details
- **Facet Filtering**: Multi-parameter search by brand, category, gender (Men, Women, Unisex), shoe size (`38`–`46`), color, and price sliders in Sri Lankan Rupees.
- **Interactive Product Page (`/product/:slug`)**: Multi-angle image gallery with thumbnail preview switching, live variant stock indicator, real-time price formatting (`Rs. 12,500.00`), and detailed technical specifications.
- **Stock Guardrails**: Out-of-stock sizes and color variants are clearly denoted to prevent duplicate or invalid purchases.

### 3. Shopping Bag & Free Delivery Progress Meter
- **Slide-Out Cart Drawer**: Immediate cart inspection from any page without navigation disruptions.
- **Free Delivery Progress Indicator**: Visual progress bar tracking order value toward the free islandwide delivery threshold (Free over **Rs. 15,000.00**; standard delivery fee: **Rs. 650.00**).
- **Multi-Account Cart Isolation**: Shopping cart items are strictly bound to authenticated customer IDs in MongoDB, with fallback to local storage for guests.

### 4. Customer Wishlist
- **Quick Favorites**: One-click heart toggle on product cards and product detail pages.
- **Persistent Wishlist (`/wishlist`)**: Live stock sync and direct "Move to Bag" actions.

### 5. Seamless Checkout & Order Lifecycle
- **Dual Payment Channels**:
  - **Cash on Delivery (COD)**: Doorstep cash settlement across all 9 provinces in Sri Lanka.
  - **Direct Bank Transfer**: Account payment details provided for Commercial Bank of Ceylon and Hatton National Bank (HNB).
- **Live Order Tracking (`/orders`)**: Visual step-by-step progress tracker (*Pending &rarr; Confirmed &rarr; Processing &rarr; Shipped &rarr; Delivered*).

### 6. Recipient-Only Digital Gift Vouchers
- **Voucher Studio Showcase (`/gift-vouchers`)**: Purchase digital footwear gift vouchers in fixed denominations (**Rs. 2,500**, **Rs. 5,000**, **Rs. 10,000**, and **Rs. 15,000**).
- **Recipient Security**: Vouchers are securely assigned to a designated recipient email address.
- **Customer Voucher Wallet (`/my-vouchers`)**: Only the authenticated recipient can view and reveal the 16-character alphanumeric redemption code.

### 7. STRIDEX Smart AI Shopping Chatbot
- **Sneaker Mascot Interface**: Floating interactive mascot with unread badge notification counter and collapsible chat window.
- **Dual-Provider Architecture**: Powered by backend AI engine supporting Google Gemini and Groq Cloud (`openai/gpt-oss-120b`).
- **Dynamic Live Shoe Recommendations**: Automatically displays interactive product recommendation cards with image, price, available sizes, and direct navigation.
- **Formatted Markdown & Typography**: Renders bold text in stylish **Outfit** typography, clean bullet lists with mint indicators, and structured steps.
- **Short-Term Conversation Memory**: Preserves the latest 5 exchanges per session, isolated strictly between guest and logged-in users.
- **Rate Limit Safeguards**: Enforces 10 messages per 10 minutes sliding window with live countdown notice.

### 8. Back-Office Administrative Console (`/admin`)
- **Multi-Provider Bot Controls**: Switch primary AI between Google Gemini and Groq Cloud, toggle automatic backup failover with an accessible non-overlapping switch, and inspect backend API key configuration.
- **Financial & Sales Reports**: Date range filtering (*Today, Last 7 Days, Last 30 Days, This Month, Custom Dates*), accurate revenue accounting (excluding cancelled/pending orders), payment method breakdowns, and best-selling footwear rankings with `TrendingUp` analytics icon.
- **Product & Variant Catalog CRUD**: Add, edit, and deactivate shoes with Supabase Storage image upload and variant matrix management.
- **Order Management**: Transition order statuses and record bank payment verification.
- **Customer & User Role Management**: Manage user permissions (Customer, Inventory Manager, Administrator).

### 9. Warehouse Inventory Console (`/inventory`)
- **Real-Time Stock Matrix**: Monitor SKU-level variant inventory across sizes and colors.
- **Stock Adjustments**: Record Stock-In shipments, Stock-Out dispatches, and damaged footwear write-offs with audit notes.
- **Low-Stock Alert Center**: Highlight variants reaching critical thresholds (&le; 5 units).

---

## 📁 Frontend Directory Structure

```text
Shoe_Store_Frontend/
├── public/                      # Static icons, web manifest, and favicon
├── src/
│   ├── assets/                  # Brand vectors, video loops, editorial portraits
│   ├── components/
│   │   ├── ai/                  # AI Chatbot, window, mascot, recommendation card
│   │   ├── cart/                # Cart slide-over drawer and checkout item list
│   │   ├── common/              # Navbar, footer, loaders, modals, scroll reveal
│   │   ├── orders/              # Order details modal and timeline visualizer
│   │   ├── shop/                # Product card, filter sidebar, search inputs
│   │   └── vouchers/            # Voucher purchase card and redemption modal
│   ├── context/                 # Toast notification context provider
│   ├── hooks/                   # Typed Redux hooks (useAppDispatch, useAppSelector)
│   ├── pages/
│   │   ├── admin/               # Admin sub-pages (Bot Controls, Reports, Products, Orders, Users)
│   │   ├── dashboard/           # AdminDashboardPage & InventoryDashboardPage
│   │   ├── inventory/           # Inventory stock management views
│   │   ├── shop/                # ShopPage, ProductDetailsPage, CategoryPage, BrandsPage
│   │   ├── CartPage.tsx         # Full-page shopping cart with delivery progress
│   │   ├── CheckoutPage.tsx     # Address, payment method, voucher redemption
│   │   ├── HomePage.tsx         # Cinematic home with marquee & dynamic collections
│   │   ├── LoginPage.tsx        # Customer and staff authentication
│   │   ├── OrdersPage.tsx       # Customer order history and live tracking
│   │   ├── RegisterPage.tsx     # New customer account registration
│   │   └── VouchersPage.tsx     # Gift voucher store & wallet
│   ├── services/                # Axios API services (products, orders, auth, ai, vouchers)
│   ├── store/                   # Redux Toolkit store and slices (auth, cart, wishlist)
│   ├── types/                   # TypeScript domain models and API responses
│   ├── utils/                   # Currency formatter (LKR), date helpers, validation
│   ├── App.tsx                  # Main router configuration & Vercel Analytics wrapper
│   ├── index.css                # Tailwind directives and design system tokens
│   └── main.tsx                 # React DOM application mount entry
├── .env.example                 # Environment configuration template
├── package.json                 # Dependencies and build scripts
├── tailwind.config.js           # Theme extensions, colors, font families
├── tsconfig.json                # TypeScript project configuration
└── vite.config.ts               # Vite bundler plugins and server options
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: `v18.0.0` or higher (LTS recommended)
- **Package Manager**: `npm` (`v9.0.0` or higher)

### 1. Navigate to Frontend Directory
```bash
cd Shoe_Store_Frontend
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a local `.env` file from the variables:
```

Edit `.env` to point to your backend API server:
```env
# STRIDEX Frontend Environment Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

> **Note**: For production deployments (e.g. Vercel), set `VITE_API_BASE_URL` to your production backend URL (e.g., `https://your-backend-api.onrender.com/api/v1`).

### 4. Run Development Server
```bash
npm run dev
```
The application will launch with Hot Module Replacement (HMR) at:  
👉 **`http://localhost:5173`**

### 5. Build for Production
To typecheck and bundle the optimized static client:
```bash
npm run build
```
Compiled production assets will be output to the `dist/` folder.

### 6. Preview Production Build Locally
```bash
npm run preview
```

---

## 🔒 Security & Privacy Notice

- **No Hardcoded Credentials**: This project contains zero exposed API keys, database credentials, or private authentication tokens in the frontend source code.
- **Stateless Tokens**: Authentication utilizes secure JWT tokens stored in browser storage and transmitted via standard HTTP Authorization headers.
- **Environment Isolation**: All AI provider keys and database URIs remain strictly confined to the backend server environment.

---

## 📄 License & Attribution

Developed as part of the **Rapid Application Development (RAD)** coursework. All brand marks and product silhouettes belong to their respective trademark owners and are utilized for academic demonstration purposes.
