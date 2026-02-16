# Ecommerce Frontend

A modern, responsive ecommerce frontend built with React, TypeScript, and TailwindCSS.

## Features

- 🛍️ Full-featured product browsing and shopping cart
- 🔍 Advanced product search with vector similarity
- 📱 Fully responsive design
- 🎨 Modern UI with TailwindCSS
- ✅ TypeScript for type safety
- 🛒 Persistent cart with Zustand
- 💳 Complete checkout flow
- 📦 Order tracking and confirmation

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on port 7999

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   └── Search.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── store/          # State management
│   │   └── cartStore.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features Overview

### Shopping Experience
- Browse products by section and category
- Featured products on homepage
- Product search with AI-powered similarity
- Detailed product pages with specifications
- Add to cart with quantity selection

### Cart & Checkout
- Persistent cart across sessions
- Real-time cart updates
- Tax and shipping calculations
- Complete checkout form with validation
- Order confirmation with details

### UI/UX
- Responsive design for all devices
- Loading states and error handling
- Toast notifications
- Smooth transitions and animations
- Professional, clean design

## API Integration

The frontend connects to the backend API at `http://localhost:7999/api/v1` and uses the following endpoints:

- `GET /site-config` - Site configuration
- `GET /sections` - Product sections
- `GET /categories` - Product categories
- `GET /products` - All products (paginated)
- `GET /products/featured` - Featured products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Product details
- `POST /orders` - Create order

## Environment Variables

Create a `.env` file if you need custom configuration:

```env
VITE_API_URL=http://localhost:7999
```

## Development

- Hot module replacement enabled
- TypeScript strict mode
- Automatic type checking
- ESLint ready (add configuration)

## License

Private - All rights reserved
