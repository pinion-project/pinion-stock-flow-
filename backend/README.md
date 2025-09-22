# Pinion Stock Flow - Backend API

A comprehensive backend API for the Pinion Stock Flow inventory management system built with Node.js, Express.js, TypeScript, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with role-based access control
- 📦 Complete inventory management system
- 🏢 Multi-warehouse support
- 👥 User management with granular permissions
- 📊 Real-time notifications and updates
- 📈 Analytics and reporting
- 🔍 Advanced search and filtering
- 📱 RESTful API design
- 🛡️ Security best practices
- 📝 Comprehensive logging
- 🧪 Full test coverage

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pinion_stock_flow?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Redis
REDIS_URL="redis://localhost:6379"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Logging
LOG_LEVEL="info"
LOG_FILE_PATH="./logs/app.log"
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (admin only)

### Health Check

- `GET /health` - Server health status

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The database includes the following main entities:

- **Users** - User management with roles and permissions
- **Warehouses** - Warehouse information and capacity
- **Products** - Product catalog with specifications
- **Inventory** - Stock levels per warehouse
- **Transactions** - All inventory movements
- **Suppliers** - Supplier information
- **Notifications** - System notifications
- **Audit Logs** - System audit trail

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection
- Audit logging

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Development

### Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Data models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
├── config/         # Configuration
├── database/       # Database related files
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

### Adding New Features

1. Create types in `src/types/`
2. Add database models in `prisma/schema.prisma`
3. Create services in `src/services/`
4. Add controllers in `src/controllers/`
5. Define routes in `src/routes/`
6. Write tests in `tests/`

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
# Build image
docker build -t pinion-stock-flow-backend .

# Run container
docker run -p 3000:3000 pinion-stock-flow-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team.
