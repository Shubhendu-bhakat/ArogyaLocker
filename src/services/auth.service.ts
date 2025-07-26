import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  dob?: Date | null;
  gender?: string | null;
  blood_group?: string | null;
  address?: string | null;
  emergency_contact?: string | null;
}

// Auth service class
class AuthService {
  // Register a new user
  async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into database
      const result = await pool.query(
        'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, phone]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = this.generateToken(user);

      // Return user and token
      return { user, token };
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  // Login user
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    try {
      // Find user by email
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      // Check if user exists
      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      // Return user without password and token
      delete user.password;
      return { user, token };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  // Generate JWT token
  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      delete user.password;
      
      return user;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      // Build update query
      const keys = Object.keys(userData);
      const values = Object.values(userData);
      
      // Handle empty update
      if (keys.length === 0) {
        throw new Error('No fields to update');
      }
      
      // Build the SET part of the query
      const setString = keys
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');
      
      // Add the ID as the last parameter
      values.push(id);
      
      // Execute the query
      const result = await pool.query(
        `UPDATE users SET ${setString} WHERE id = $${values.length} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const updatedUser = result.rows[0];
      delete updatedUser.password;
      
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string, newPassword: string): Promise<void> {
    try {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password in database
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2 RETURNING id',
        [hashedPassword, email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  }
}

export default new AuthService(); 