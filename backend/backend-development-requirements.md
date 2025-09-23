# Pinion Stock Flow - Backend Development Requirements

## Project Overview
This document outlines the complete backend implementation requirements for the Pinion Stock Flow inventory management system. The backend will be built using Node.js/Express with TypeScript, PostgreSQL database, and will support the existing React frontend with Arabic language support and RTL layout.

## Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma (for type-safe database operations)
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io for WebSocket connections
- **File Storage**: AWS S3 or local storage for development
- **Validation**: Joi or Zod for request validation
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## Database Schema Requirements

### Core Tables
1. **users** - User management with role-based access
2. **warehouses** - Warehouse information and capacity
3. **products** - Product catalog with detailed specifications
4. **inventory** - Stock levels per warehouse
5. **suppliers** - Supplier information and contacts
6. **transactions** - All inventory movements and financial transactions
7. **inventory_movements** - Detailed stock movement history
8. **purchase_orders** - Purchase order management
9. **notifications** - System notifications and alerts
10. **audit_logs** - System audit trail
11. **settings** - System configuration
12. **files** - File uploads and document management

### Key Relationships
- Users → Warehouses (many-to-many with roles)
- Products → Warehouses (through inventory table)
- Transactions → Products, Warehouses, Users
- Inventory Movements → Transactions, Products, Warehouses

## API Endpoints Structure

### 1. Authentication & Authorization (`/api/auth`)
```
POST   /login              - User authentication
POST   /refresh            - Token refresh
POST   /logout             - User logout
GET    /me                 - Get current user profile
POST   /change-password    - Change user password
POST   /forgot-password    - Password reset request
POST   /reset-password     - Password reset confirmation
```

### 2. User Management (`/api/users`)
```
GET    /                   - List users (with pagination/filtering)
POST   /                   - Create new user
GET    /:id                - Get user details
PUT    /:id                - Update user
DELETE /:id                - Deactivate user
PUT    /:id/activate       - Activate user
PUT    /:id/permissions    - Update user permissions
GET    /:id/activity       - Get user activity log
```

### 3. Warehouse Management (`/api/warehouses`)
```
GET    /                   - List warehouses (filtered by permissions)
POST   /                   - Create warehouse
GET    /:id                - Get warehouse details
PUT    /:id                - Update warehouse
DELETE /:id                - Delete warehouse
GET    /:id/capacity       - Get capacity metrics
GET    /:id/products       - Get products in warehouse
GET    /:id/performance    - Get performance metrics
POST   /:id/transfer       - Transfer products between warehouses
```

### 4. Product Management (`/api/products`)
```
GET    /                   - List products (with filtering/pagination)
POST   /                   - Create product
GET    /:id                - Get product details
PUT    /:id                - Update product
DELETE /:id                - Delete product
GET    /search             - Search products
GET    /categories         - Get product categories
GET    /:id/history        - Get product transaction history
POST   /bulk-import        - Bulk import products
GET    /export             - Export products data
```

### 5. Inventory Management (`/api/inventory`)
```
GET    /                   - Get inventory levels across warehouses
POST   /transactions       - Record inventory transaction
GET    /movements          - Get movement history
PUT    /adjust             - Adjust inventory levels
GET    /low-stock          - Get low stock alerts
POST   /transfer           - Transfer stock between warehouses
GET    /reports            - Generate inventory reports
GET    /analytics          - Get inventory analytics
POST   /cycle-count        - Perform cycle count
```

### 6. Supplier Management (`/api/suppliers`)
```
GET    /                   - List suppliers
POST   /                   - Create supplier
GET    /:id                - Get supplier details
PUT    /:id                - Update supplier
DELETE /:id                - Delete supplier
GET    /:id/products       - Get supplier products
GET    /:id/performance    - Get supplier performance
POST   /:id/contact        - Send message to supplier
```

### 7. Purchase Order Management (`/api/purchase-orders`)
```
GET    /                   - List purchase orders
POST   /                   - Create purchase order
GET    /:id                - Get purchase order details
PUT    /:id                - Update purchase order
DELETE /:id                - Cancel purchase order
POST   /:id/approve        - Approve purchase order
POST   /:id/receive        - Mark as received
GET    /suggestions        - Get purchase suggestions
GET    /reports            - Generate purchase reports
```

### 8. Analytics & Reporting (`/api/analytics`)
```
GET    /dashboard          - Dashboard metrics and KPIs
GET    /inventory          - Inventory analytics
GET    /warehouse          - Warehouse performance
GET    /financial          - Financial analytics
GET    /trends             - Trend analysis
GET    /forecasting        - Inventory forecasting
POST   /custom-report      - Generate custom report
```

### 9. Notification System (`/api/notifications`)
```
GET    /                   - Get user notifications
POST   /                   - Create notification
PUT    /:id/read           - Mark as read
PUT    /:id/unread         - Mark as unread
DELETE /:id                - Delete notification
PUT    /read-all           - Mark all as read
GET    /settings           - Get notification settings
PUT    /settings           - Update notification settings
```

### 10. File Management (`/api/files`)
```
POST   /upload             - Upload file
GET    /:id                - Download file
DELETE /:id                - Delete file
GET    /                   - List user files
POST   /bulk-upload        - Bulk file upload
```

### 11. System Management (`/api/system`)
```
GET    /settings           - Get system settings
PUT    /settings           - Update system settings
GET    /audit-logs         - Get audit logs
POST   /backup             - Create system backup
POST   /restore            - Restore from backup
GET    /health             - System health check
GET    /stats              - System statistics
```

## Data Models (TypeScript Interfaces)

### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'GENERAL_MANAGER' | 'WAREHOUSE_MANAGER' | 'PURCHASING_MANAGER';
  warehouseId?: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  nameEn: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory: string;
  brand: string;
  model?: string;
  description: string;
  specifications?: Record<string, string>;
  unit: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  images?: string[];
  warranty?: number;
  expiryDate?: string;
  batchNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Warehouse Model
```typescript
interface Warehouse {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  type: 'distribution' | 'manufacturing' | 'retail' | 'cold_storage' | 'hazmat' | 'general';
  status: 'active' | 'inactive' | 'maintenance' | 'expansion';
  location: {
    address: string;
    city: string;
    governorate: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity: {
    maxVolume: number;
    maxWeight: number;
    currentStock: number;
    availableSpace: number;
    reservedSpace: number;
  };
  manager: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  contactInfo: {
    phone: string;
    fax?: string;
    email: string;
    website?: string;
    emergencyContact: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Model
```typescript
interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'return';
  date: Date;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  currency: 'EGP';
  taxAmount?: number;
  discountAmount?: number;
  warehouseId: string;
  warehouseName: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  supplierId?: string;
  supplierName?: string;
  customerId?: string;
  customerName?: string;
  userId: string;
  userName: string;
  userRole: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'returned';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Requirements

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC) with granular permissions
- Password hashing using bcrypt
- Account lockout after failed login attempts
- Session management and token rotation

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting on API endpoints
- Data encryption at rest and in transit

### API Security
- CORS configuration for frontend domain
- Request size limits
- File upload security
- Audit logging for all operations
- IP whitelisting for admin operations

## Real-time Features

### WebSocket Implementation
- Real-time inventory updates
- Live notification delivery
- Dashboard updates
- Collaborative features
- Connection management and reconnection

### Notification Types
- Low stock alerts
- Inventory movements
- System updates
- User actions
- Report generation completion

## Performance Requirements

### Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Database partitioning for large tables
- Caching strategy (Redis)

### API Performance
- Response time < 200ms for most endpoints
- Pagination for large datasets
- Compression for large responses
- CDN for static files
- Background job processing

## Development Phases

### Phase 1: Core Infrastructure (Week 1-2) ✅ COMPLETED
- [x] Project setup with TypeScript and Express
- [x] Database schema design and migration
- [x] Basic authentication system
- [x] User management APIs
- [x] Basic error handling and logging

### Phase 2: Core Business Logic (Week 3-4) ✅ COMPLETED
- [x] Warehouse management APIs
- [x] Product management APIs
- [x] Inventory management APIs
- [x] Transaction recording system
- [x] Basic reporting

### Phase 3: Advanced Features (Week 5-6) ✅ COMPLETED
- [x] Real-time notifications
- [x] File upload system
- [x] Advanced analytics
- [x] Purchase order management
- [x] Supplier management

### Phase 4: Integration & Testing (Week 7-8) ✅ COMPLETED
- [x] Frontend integration
- [x] API documentation
- [x] Comprehensive testing
- [x] Performance optimization
- [x] Security audit

### Phase 5: Production Readiness (Week 9-10) 🚧 IN PROGRESS
- [ ] Deployment configuration
- [ ] Monitoring and alerting
- [ ] Backup and recovery
- [ ] Load testing
- [ ] Production deployment

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- Data validation
- Business logic

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flows
- File upload/download

### End-to-End Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile responsiveness
- Performance testing

## Deployment Requirements

### Environment Configuration
- Development environment
- Staging environment
- Production environment
- Environment-specific configurations

### Infrastructure
- Docker containerization
- CI/CD pipeline
- Database migrations
- Health checks
- Monitoring and logging

### Scalability
- Horizontal scaling capability
- Database replication
- Load balancing
- Caching layers

## Documentation Requirements

### API Documentation
- OpenAPI 3.0 specification
- Interactive API explorer
- Request/response examples
- Error code documentation

### Technical Documentation
- Database schema documentation
- Architecture diagrams
- Deployment guide
- Troubleshooting guide

### User Documentation
- API integration guide
- Authentication guide
- Webhook documentation
- Rate limiting guide

## Monitoring & Maintenance

### Logging
- Application logs
- Error tracking
- Performance metrics
- Security events

### Monitoring
- System health monitoring
- Database performance
- API response times
- Error rates

### Maintenance
- Regular security updates
- Database maintenance
- Performance optimization
- Backup verification

## Success Criteria

### Functional Requirements
- All frontend features supported
- Real-time updates working
- Arabic language support
- Role-based access control
- Comprehensive reporting

### Non-Functional Requirements
- Response time < 200ms
- 99.9% uptime
- Support for 1000+ concurrent users
- Secure data handling
- Scalable architecture

### Quality Requirements
- 90%+ test coverage
- Zero critical security vulnerabilities
- Comprehensive documentation
- Production-ready deployment
- Performance benchmarks met

This comprehensive backend implementation will provide a robust, scalable, and secure foundation for the Pinion Stock Flow inventory management system, fully supporting the existing React frontend with all its features and requirements.
