# Pinion Stock Flow - Inventory Management System

A comprehensive inventory management system built with modern web technologies for efficient warehouse and stock management operations.

## 🏢 Project Overview

Pinion Stock Flow is a sophisticated inventory management application designed for businesses operating multiple warehouses across Egypt. The system provides real-time inventory tracking, warehouse management, analytics, and reporting capabilities with support for Arabic language interface.

### Key Features

- **Multi-Warehouse Management**: Manage multiple warehouses with detailed capacity tracking
- **Real-time Inventory Tracking**: Monitor stock levels, movements, and transactions
- **Advanced Analytics**: Comprehensive reporting and performance metrics
- **User Management**: Role-based access control and user authentication
- **Supplier Management**: Track suppliers and purchase orders
- **Product Catalog**: Detailed product information with SKU management
- **Audit Logs**: Complete transaction history and audit trails
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Arabic Language Support**: Full RTL support for Arabic interface

## 🚀 Installation Guide

### Prerequisites

Before installing the project, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Or install using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd pinion-stock-flow
```

#### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

#### 3. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Alternative Installation Methods

#### Using Lovable Platform

1. Visit the [Lovable Project](https://lovable.dev/projects/8847ada0-2697-406d-8010-c7939a6b7e47)
2. Start prompting to make changes
3. Changes will be automatically committed to the repository

#### Using GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click the "Code" button (green button)
3. Select the "Codespaces" tab
4. Click "New codespace" to launch the development environment
5. Run `npm install` and `npm run dev` in the terminal

#### Direct GitHub Editing

1. Navigate to the desired file(s) in the GitHub repository
2. Click the "Edit" button (pencil icon)
3. Make your changes and commit them directly

## What technologies are used for this project?

This project is built with:

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19 for fast development and building
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 3.4.17 with custom animations
- **State Management**: React Context API and TanStack Query
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form with Zod validation
- **Charts & Analytics**: Recharts for data visualization
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns library
- **Notifications**: Sonner for toast notifications
- **Theme Support**: next-themes for dark/light mode

## 📜 Available Scripts

After installation, you can run the following commands:

### Development

```bash
# Start development server with hot reload
npm run dev
# or
yarn dev
```

Runs the app in development mode at `http://localhost:5173`

### Building

```bash
# Build for production
npm run build
# or
yarn build
```

Builds the app for production to the `dist` folder with optimized bundles.

```bash
# Build for development (with source maps)
npm run build:dev
# or
yarn build:dev
```

### Code Quality

```bash
# Run ESLint for code linting
npm run lint
# or
yarn lint
```

Analyzes the code for potential errors and style issues.

### Preview

```bash
# Preview production build locally
npm run preview
# or
yarn preview
```

Serves the production build locally for testing before deployment.

## 📁 Project Structure

```
pinion-stock-flow/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── alerts/        # Alert components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── data/          # Data display components
│   │   ├── layout/        # Layout components
│   │   ├── maps/          # Map components
│   │   ├── navigation/    # Navigation components
│   │   ├── notifications/ # Notification components
│   │   ├── realtime/      # Real-time components
│   │   └── ui/            # Base UI components (shadcn/ui)
│   ├── contexts/          # React Context providers
│   │   ├── AlertContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── RealtimeContext.tsx
│   ├── data/              # Mock data and database
│   │   ├── products.ts
│   │   ├── suppliers.ts
│   │   ├── transactions.ts
│   │   ├── users.ts
│   │   └── warehouses.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/               # Utility functions
│   │   └── utils.ts
│   ├── pages/             # Application pages/routes
│   │   ├── Analytics.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── BackupRestore.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DataManagement.tsx
│   │   ├── Index.tsx
│   │   ├── Inventory.tsx
│   │   ├── InventoryReports.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Notifications.tsx
│   │   ├── Products.tsx
│   │   ├── Profile.tsx
│   │   ├── PurchaseSuggestions.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   ├── Users.tsx
│   │   ├── WarehouseDetails.tsx
│   │   └── Warehouses.tsx
│   ├── services/          # API services
│   │   └── authService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── auth.ts
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Deployment

### Using Lovable Platform

1. Open [Lovable](https://lovable.dev/projects/8847ada0-2697-406d-8010-c7939a6b7e47)
2. Click on Share → Publish
3. Your application will be deployed automatically

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider:
   - **Vercel**: Connect your GitHub repository
   - **Netlify**: Drag and drop the `dist` folder
   - **GitHub Pages**: Use GitHub Actions for automatic deployment

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

For more details, see: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port
npx kill-port 5173

# Or start on a different port
npm run dev -- --port 3000
```

#### Node Version Issues
Ensure you're using Node.js 18.0 or higher:
```bash
# Check Node version
node --version

# Update Node using nvm
nvm install 18
nvm use 18
```

#### Package Installation Errors
Clear cache and reinstall:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Build Errors
If you encounter build errors:
1. Check for TypeScript errors: `npm run lint`
2. Ensure all dependencies are installed
3. Clear the build cache: `rm -rf dist`

### Getting Help

- **Documentation**: Check the [Lovable Documentation](https://docs.lovable.dev/)
- **Issues**: Report bugs in the GitHub repository
- **Community**: Join the Lovable community for support

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This project is currently maintained through the Lovable platform. To contribute:

1. Visit the [Lovable Project](https://lovable.dev/projects/8847ada0-2697-406d-8010-c7939a6b7e47)
2. Use the AI assistant to make changes
3. Changes will be automatically committed to the repository

For local development contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
#   p i n i o n - s t o c k - f l o w -  
 