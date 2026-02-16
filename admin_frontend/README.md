# E-Commerce Admin Frontend

Professional React admin dashboard for managing your e-commerce platform.

## Features

- 📊 **Dashboard** - Overview with key statistics and metrics
- ⚙️ **Site Configuration** - Manage company details, logo, contact info
- 📑 **Sections Management** - Create and organize content sections
- 🗂️ **Categories Management** - Full CRUD for product categories
- 📦 **Products Management** - Comprehensive product management with search
- 🛒 **Orders Management** - View and manage customer orders

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and handling
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

## Prerequisites

- Node.js 16+ 
- npm or yarn or pnpm or bun
- Backend API running on port 7999

## Installation

```bash
cd admin_frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
admin_frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   └── Layout.jsx     # Main layout with sidebar
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── SiteConfig.jsx
│   │   ├── Sections.jsx
│   │   ├── Categories.jsx
│   │   ├── Products.jsx
│   │   └── Orders.jsx
│   ├── services/         # API service layer
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## API Integration

The frontend connects to the backend API at `http://localhost:7999/api/v1`. 

The Vite dev server is configured with a proxy to forward `/api` requests to the backend, enabling seamless development without CORS issues.

## Features Overview

### Dashboard
- Total orders, revenue, products, categories, and sections
- Quick stats overview

### Site Configuration
- Company name and logo
- Contact information (email, phone, address)
- Currency and timezone settings
- Maintenance mode toggle

### Sections
- Create, read, update, delete sections
- Active/inactive status toggle
- Auto-slug generation

### Categories
- Full CRUD operations
- Link to parent sections
- Status management

### Products
- Comprehensive product management
- Search functionality
- Price, inventory, and SKU tracking
- Featured product marking
- Category and section assignment
- Image URL support

### Orders
- View all orders
- Create new orders
- Edit order status
- View detailed order information
- Calculate totals (subtotal, tax, shipping)
- Customer information management

## Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary: Blue (#3b82f6)
- Clean, modern design
- Responsive layout
- Professional UI components

## Development Tips

1. Make sure the backend API is running on port 7999 before starting the frontend
2. Use `npm run dev` for hot-reload during development
3. Check the browser console for any API errors
4. All forms include validation with helpful error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved
