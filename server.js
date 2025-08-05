const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DyeGLUkWmu53@ep-fragrant-waterfall-afa7a6ne-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    // Drop existing table if it exists
    await pool.query('DROP TABLE IF EXISTS techniques');
    
    await pool.query(`
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
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();

// API Routes

// Get all techniques
app.get('/api/techniques', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM techniques ORDER BY category, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching techniques:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get techniques by category
app.get('/api/techniques/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM techniques WHERE category = $1 ORDER BY name',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching techniques by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM techniques ORDER BY category');
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get technique by ID
app.get('/api/techniques/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM techniques WHERE technique_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technique not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching technique:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new technique
app.post('/api/techniques', async (req, res) => {
  try {
    const { technique_id, name, category, description, best_response } = req.body;
    
    const result = await pool.query(
      'INSERT INTO techniques (technique_id, name, category, description, best_response) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [technique_id, name, category, description, best_response]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding technique:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Technique already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update technique
app.put('/api/techniques/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, best_response } = req.body;
    
    const result = await pool.query(
      'UPDATE techniques SET name = $1, category = $2, description = $3, best_response = $4, updated_at = CURRENT_TIMESTAMP WHERE technique_id = $5 RETURNING *',
      [name, category, description, best_response, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technique not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating technique:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete technique
app.delete('/api/techniques/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM techniques WHERE technique_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technique not found' });
    }
    
    res.json({ message: 'Technique deleted successfully' });
  } catch (error) {
    console.error('Error deleting technique:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 