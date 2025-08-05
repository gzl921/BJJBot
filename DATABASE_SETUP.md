# BJJBot Database Setup

This document explains how to set up and use the PostgreSQL database for the BJJBot application.

## Overview

The BJJBot application has been migrated from hardcoded data to a PostgreSQL database hosted on Neon. This allows for dynamic updates and easier management of BJJ techniques.

## Database Schema

The main table is `techniques` with the following structure:

```sql
CREATE TABLE techniques (
  id SERIAL PRIMARY KEY,
  technique_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  best_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with your database connection:

```env
DATABASE_URL=postgresql://neondb_owner:npg_DyeGLUkWmu53@ep-fragrant-waterfall-afa7a6ne-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Database Server

```bash
npm run server
```

This will:
- Connect to your PostgreSQL database
- Create the necessary tables
- Start the API server on port 3001

### 4. Migrate Data

To populate the database with all existing techniques:

```bash
npm run migrate
```

This will:
- Clear any existing data
- Import all 134 techniques from the original data file
- Verify the migration was successful

### 5. Start the Full Application

To run both the backend server and frontend:

```bash
npm run dev
```

This starts:
- Backend API server on port 3001
- React frontend on port 3000

## API Endpoints

The backend provides the following REST API endpoints:

### GET /api/health
Health check endpoint

### GET /api/techniques
Get all techniques

### GET /api/techniques/:id
Get a specific technique by ID

### GET /api/techniques/category/:category
Get all techniques in a specific category

### GET /api/categories
Get all available categories

### POST /api/techniques
Add a new technique

### PUT /api/techniques/:id
Update an existing technique

### DELETE /api/techniques/:id
Delete a technique

## Adding New Techniques

You can add new techniques in several ways:

### 1. Via API (Programmatically)

```bash
curl -X POST http://localhost:3001/api/techniques \
  -H "Content-Type: application/json" \
  -d '{
    "technique_id": "new-technique-id",
    "name": "New Technique Name",
    "category": "Submission",
    "description": "Description of the technique...",
    "best_response": "Best response to this technique..."
  }'
```

### 2. Via Database Directly

Connect to your PostgreSQL database and insert directly:

```sql
INSERT INTO techniques (technique_id, name, category, description, best_response)
VALUES ('new-technique-id', 'New Technique Name', 'Submission', 'Description...', 'Best response...');
```

### 3. Via Frontend (Future Enhancement)

A web interface for managing techniques could be added in the future.

## Database Management

### Backup

To backup your database:

```bash
pg_dump "postgresql://neondb_owner:npg_DyeGLUkWmu53@ep-fragrant-waterfall-afa7a6ne-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" > backup.sql
```

### Restore

To restore from backup:

```bash
psql "postgresql://neondb_owner:npg_DyeGLUkWmu53@ep-fragrant-waterfall-afa7a6ne-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" < backup.sql
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check your `.env` file has the correct `DATABASE_URL`
2. Verify your Neon database is active
3. Check network connectivity

### Migration Issues

If the migration fails:

1. Ensure the server is running first (`npm run server`)
2. Check the database connection
3. Verify the techniques data file exists

### API Issues

If the API isn't responding:

1. Check the server is running (`npm run server`)
2. Verify the port isn't being used by another process
3. Check the server logs for errors

## Development

### Adding New Features

To add new features to the API:

1. Add new endpoints in `server.js`
2. Update the frontend API service in `src/services/api.ts`
3. Update the frontend components as needed

### Database Schema Changes

If you need to modify the database schema:

1. Update the `createTables` function in `server.js`
2. Run the migration script to recreate tables
3. Update the frontend interfaces if needed

## Production Deployment

For production deployment:

1. Set up environment variables for production database
2. Configure CORS settings appropriately
3. Set up proper logging and monitoring
4. Consider using connection pooling for better performance
5. Set up automated backups

## Security Considerations

- Keep your database credentials secure
- Use environment variables for sensitive data
- Consider implementing authentication for write operations
- Regularly update dependencies
- Monitor database access logs 