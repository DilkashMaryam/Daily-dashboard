# Rest Express Application

## Overview

This is a full-stack web application for managing routine items/bookmarks built with React frontend and Express backend. The application allows users to create, edit, delete, and track usage statistics for their frequently visited websites or links.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, Vite build tool
- **Backend**: Express.js with TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Deployment**: Production build outputs to `dist/` directory

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch API with TanStack Query wrapper

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Validation**: Zod schemas shared between client and server
- **Middleware**: JSON parsing, URL encoding, custom logging
- **Error Handling**: Global error handler with status code mapping

### Database Schema
The application uses a single `routine_items` table with the following structure:
- `id`: Primary key (UUID)
- `name`: Item name (required)
- `url`: Website URL (required, validated)
- `description`: Optional description
- `order`: Sort order (integer, default 0)
- `clickCount`: Usage tracking (integer, default 0)
- `createdAt`: Timestamp (default current time)

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle CRUD operations for routine items
3. **Data Storage**: Currently uses in-memory storage with default demo data
4. **Response Handling**: Consistent JSON responses with error handling
5. **State Updates**: TanStack Query automatically invalidates and refetches data after mutations

### API Endpoints
- `GET /api/items` - Retrieve all routine items
- `POST /api/items` - Create new routine item
- `PATCH /api/items/:id` - Update existing item
- `DELETE /api/items/:id` - Delete item (planned)
- `POST /api/items/:id/click` - Increment click counter (planned)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: Schema validation library
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives (30+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production server build

## Deployment Strategy

### Development
- **Client**: Vite dev server with HMR on `/client` directory
- **Server**: tsx watch mode for TypeScript execution
- **Database**: Uses DATABASE_URL environment variable
- **Command**: `npm run dev`

### Production Build
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: `npm run db:push` applies schema changes
4. **Command**: `npm run build` then `npm start`

### Environment Configuration
- **DATABASE_URL**: Required PostgreSQL connection string
- **NODE_ENV**: Environment flag (development/production)
- Drizzle config points to `./shared/schema.ts` for database schema

### Key Architectural Decisions

1. **Shared Schema**: Database schema and validation logic in `/shared` directory allows type safety between client and server
2. **In-Memory Storage**: Current implementation uses memory storage with plans to migrate to PostgreSQL (Drizzle config already prepared)
3. **Component Library**: shadcn/ui provides pre-built accessible components while maintaining customization flexibility
4. **Monorepo Structure**: Single repository with clear client/server separation simplifies development and deployment
5. **TypeScript Throughout**: Full type safety from database to UI components
6. **Modern React Patterns**: Hooks, function components, and modern state management practices