require('dotenv').config(); // Load environment variables // [12]
const express = require('express'); // [12]
const cors = require('cors'); // [12]
const cookieParser = require('cookie-parser'); // [31]
const db = require('./models'); // Database connection and models

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware // [12]
app.use(express.json()); // Parse JSON request bodies // [12]
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies // [31]

// CORS configuration // [12, 41]
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from your frontend origin
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Mount authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // [12]

// Restaurant public routes
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurant', restaurantRoutes);

// Mount menu routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menus', menuRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the InstantMenu API!');
});

// Connect to MongoDB and start server
db.connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});