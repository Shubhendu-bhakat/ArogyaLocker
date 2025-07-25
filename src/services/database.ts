import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';


// Load environment variables from database.env
dotenv.config({ path: path.resolve(process.cwd(), 'database.env') });

// Log the environment for debugging
console.log('Database environment variables loaded');

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PG_HOST ,
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE ,
  user: process.env.PG_USER ,
  password: process.env.PG_PASSWORD ,
});

// Test the connection 
//one can also use the pgClient to connect to the database
//but it needs manual connection and disconnection
//and it is not as easy to use as the pool , pgClient.connect() and pgClient.end() are the two methods 
async function main() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
  }
}

main();

export default pool; 