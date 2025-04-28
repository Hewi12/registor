const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'registor_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation function
const isValidPassword = (password) => {
    // At least 8 characters
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Contains at least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    // Contains at least one number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    
    // Contains at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Contains at least one lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    return { valid: true, message: 'Password is valid' };
};

// Registration route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ error: 'Error creating user' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ error: 'Error processing registration' });
        }
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Registor API' });
});

// Example route to get data
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 