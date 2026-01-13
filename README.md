# Thob 3D Studios - Internship Assignment

Full-stack asset management application built with Next.js and Express.js, showcasing both AI-generated and self-written code implementations with identical functionality but different UI/UX approaches.

## Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Prisma ORM
- **Authentication:** JWT with bcrypt password hashing
- **API:** RESTful architecture with CORS support

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Axios with cookie-based auth
- **UI Libraries:** Framer Motion, Lucide React, Sonner
- **Storage:** Supabase integration

## Project Structure

The application features two parallel implementations:
- **/ai/\*** - AI-generated code with modern dark UI
- **/\*** - Self-written code with different design approach

Both sections share the same backend API and core functionality.

## Database Schema

### User Model
- `id` - ObjectId (primary key)
- `email` - String (unique)
- `name` - String
- `password` - String (hashed)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Asset Model
- `id` - ObjectId (primary key)
- `ownerId` - String
- `name` - String
- `description` - String
- `image` - String (URL)
- `url` - String
- `category` - String
- `format` - String
- `size` - Int
- `tags` - String[]
- `isDeleted` - Boolean (default: false)
- `createdAt` - DateTime
- `updatedAt` - DateTime

## Backend API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register new user (returns JWT token)
- `POST /login` - Login user (returns JWT token)

### Users (`/api/users`) - All routes require authentication
- `GET /me` - Get current user profile
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

### Assets (`/api/assets`) - All routes require authentication
- `GET /` - Get all assets
- `GET /:id` - Get asset by ID
- `POST /` - Create new asset
- `PUT /:id` - Update asset
- `DELETE /:id` - Delete asset

## Frontend Pages

### Root Section (Self-Written)
- `/` - Landing page with project introduction
- `/home` - Redirects to dashboard
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Asset management dashboard
- `/dashboard/[id]` - Individual asset details
- `/profile` - User profile page

### AI Section
- `/ai/home` - Landing page with grid background and animations
- `/ai/login` - User login
- `/ai/register` - User registration
- `/ai/dashboard` - Asset management dashboard
- `/ai/dashboard/[id]` - Individual asset details
- `/ai/profile` - User profile page

## Authentication

- JWT tokens with 24-hour expiration
- Tokens stored in cookies (httpOnly)
- Bearer token authentication on protected routes
- Password minimum length: 6 characters
- Middleware validates tokens on all protected endpoints

## Setup & Installation

### Backend
```bash
cd backend
npm install
# Configure .env with DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL
npm run dev  # Development
npm start    # Production
npm run seed # Seed database
```

### Frontend
```bash
cd frontend
npm install
# Configure .env with NEXT_PUBLIC_API_URL
npm run dev  # Development
npm start    # Production
```

## Environment Variables

### Backend
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Features

- User authentication with JWT
- Asset CRUD operations
- Image upload via Supabase
- Search and filtering
- Pagination
- Responsive design
- Toast notifications
- Protected routes
- Two distinct UI implementations
