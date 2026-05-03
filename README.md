# LocalConnect

> Smart Contact Dictionary & Service Marketplace for Local Workers

LocalConnect is a production-ready full-stack web application that connects users with local service providers like plumbers, electricians, mechanics, maids, and more.

## 🚀 Features

### For Users
- 🔍 **Worker Discovery** - Search and filter workers by profession, location, rating, and availability
- 📍 **Geo-based Search** - Find workers within your specified radius
- ⭐ **Reviews & Ratings** - Read genuine reviews before booking
- ❤️ **Favorites** - Save your trusted workers for quick access
- 📱 **Service Requests** - Create and track service requests

### For Workers
- 👤 **Professional Profile** - Showcase skills, experience, and certifications
- 📅 **Availability Management** - Set your working hours and service radius
- 💼 **Job Management** - Accept, reject, and complete service requests
- 📊 **Trust Score** - Build reputation through verified jobs and reviews

### For Admins
- ✅ **Worker Verification** - Verify worker credentials and documents
- 🛡️ **Review Moderation** - Monitor and moderate user reviews
- 📈 **Analytics** - Track platform metrics and performance

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Queue**: BullMQ
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod

### Infrastructure
- **Container**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **Cache**: Redis 7

## 📁 Project Structure

```
localconnect/
├── packages/
│   ├── backend/           # NestJS API
│   │   ├── prisma/        # Database schema & migrations
│   │   └── src/
│   │       ├── auth/      # Authentication module
│   │       ├── workers/   # Worker management
│   │       ├── professions/
│   │       ├── service-requests/
│   │       ├── reviews/
│   │       ├── favorites/
│   │       ├── prisma/    # Prisma service
│   │       ├── redis/     # Redis service
│   │       └── common/    # Shared utilities
│   │
│   ├── ui/                # Next.js Frontend
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   ├── hooks/         # Custom hooks
│   │   ├── stores/        # Zustand stores
│   │   └── types/         # TypeScript types
│   │
│   └── admin-ui/          # Admin Dashboard
│
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn
- Docker & Docker Compose

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd localconnect

# Install dependencies
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

Key environment variables:
```env
DATABASE_URL=postgresql://localconnect:password@localhost:5432/localconnect
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET_KEY=your_super_secret_key_min_32_chars
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker compose up -d postgres redis

# Verify services are running
docker compose ps
```

### 4. Database Setup

```bash
cd packages/backend

# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate:dev

# Seed database with sample data
yarn prisma:db:seed
```

### 5. Start Development Servers

```bash
# From root directory
# Start backend
cd packages/backend && yarn start:dev

# In another terminal - Start frontend
cd packages/ui && yarn dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Prisma Studio**: `yarn prisma:studio` (http://localhost:5555)

## 📚 API Documentation

The API documentation is available via Swagger UI at `/api/docs` when the backend is running.

### Authentication Flow

1. **Request OTP**: `POST /api/v1/auth/otp/send`
2. **Verify OTP**: `POST /api/v1/auth/otp/verify`
3. **Refresh Token**: `POST /api/v1/auth/refresh`

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/workers/search` | GET | Search workers with filters |
| `/api/v1/workers/:id` | GET | Get worker details |
| `/api/v1/professions` | GET | List all professions |
| `/api/v1/service-requests` | POST | Create service request |
| `/api/v1/reviews` | POST | Submit a review |
| `/api/v1/favorites` | GET/POST/DELETE | Manage favorites |

## 🔐 Authentication

LocalConnect uses phone OTP-based authentication:

1. User enters phone number
2. OTP is sent (mock in development)
3. User verifies OTP
4. Access + Refresh tokens are issued

In development mode, OTP is returned in the response for testing.

## 🧮 Trust Score Algorithm

Workers are ranked by a trust score calculated as:

```
trust_score = (rating × 0.6) + (jobs_normalized × 0.3) + (verification × 0.1)
```

Where:
- `rating`: Average rating (0-5)
- `jobs_normalized`: Completed jobs / 100, capped at 1, × 5
- `verification`: 5 if verified, 0 otherwise

## 🧪 Testing

```bash
# Run backend tests
cd packages/backend
yarn test

# Run e2e tests
yarn test:e2e

# Run with coverage
yarn test:cov
```

## 🐳 Docker Deployment

```bash
# Build and run all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## 📝 Available Scripts

### Root
- `yarn backend` - Start backend only
- `yarn start:dev` - Start backend + frontend
- `yarn build` - Build all packages

### Backend
- `yarn start:dev` - Development server with hot reload
- `yarn prisma:generate` - Generate Prisma client
- `yarn prisma:migrate:dev` - Run migrations
- `yarn prisma:db:seed` - Seed database
- `yarn prisma:studio` - Open Prisma Studio

### Frontend
- `yarn dev` - Development server
- `yarn build` - Production build
- `yarn start` - Start production server

## 🗄️ Database Schema

Key models:
- **User** - All users (USER, WORKER, ADMIN roles)
- **WorkerProfile** - Worker-specific information
- **Profession** - Service categories
- **ServiceRequest** - Job requests lifecycle
- **Review** - User reviews for workers
- **Favorite** - User's saved workers

See `packages/backend/prisma/schema.prisma` for complete schema.

## 🔮 Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] Payment integration
- [ ] Worker subscription plans
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Chat functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for local communities
