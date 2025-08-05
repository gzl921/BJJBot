const { Pool } = require('pg');
require('dotenv').config();

// Import all techniques from the extracted data
const techniques = require('./techniques_data');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DyeGLUkWmu53@ep-fragrant-waterfall-afa7a6ne-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

const migrateData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Clear existing data
    await pool.query('DELETE FROM techniques');
    console.log('Cleared existing data');
    
    // Insert all techniques
    for (const technique of techniques) {
      await pool.query(
        'INSERT INTO techniques (technique_id, name, category, description, best_response) VALUES ($1, $2, $3, $4, $5)',
        [
          technique.id,
          technique.name,
          technique.category,
          technique.description,
          technique.bestResponse
        ]
      );
    }
    
    console.log(`Successfully migrated ${techniques.length} techniques to database`);
    
    // Verify the data
    const result = await pool.query('SELECT COUNT(*) FROM techniques');
    console.log(`Total techniques in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
};

migrateData(); 