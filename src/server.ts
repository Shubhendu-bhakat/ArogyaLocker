import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import pool from './services/database';
import authService from './services/auth.service';

// Load environment variables from database.env
dotenv.config({ path: path.resolve(process.cwd(), 'database.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token);
    
    // Attach user to request
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    const { user, token } = await authService.register(name, email, password, phone);
    res.status(201).json({ user, token });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check for duplicate email
    if (error.code === '23505') { // PostgreSQL unique violation code
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Invalid email or password' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await authService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user endpoint
app.put('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userData = req.body;
    
    // Remove sensitive fields that shouldn't be updated this way
    delete userData.id;
    delete userData.email;
    delete userData.password;
    
    const user = await authService.updateUser(userId, userData);
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Password reset endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    
    await authService.resetPassword(email, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Initialize database tables
const initDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        dob DATE,
        gender VARCHAR(10),
        blood_group VARCHAR(5),
        address TEXT,
        emergency_contact VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    process.exit(1);
  }
};

// Start server
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`Server running on port ${PORT}`);
});

export default app; 