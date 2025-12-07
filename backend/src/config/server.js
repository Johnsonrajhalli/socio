
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO integration
const { Server } = require('socket.io'); // Socket.IO Server
const path = require("path");
const connectDB = require(path.join(__dirname, "config", "db.js"));

// Debug (optional but recommended)
console.log("Loaded connectDB from:", path.join(__dirname, "config", "db.js"));
console.log("connectDB =", connectDB);


const connectRedis = require('./config/redis'); // We will create this next!
const  protect  = require('./middleware/auth'); // Already created
const initializeSocketServer = require('./services/socketService');
// To be created later
console.log("Loaded initializeSocketServer =", initializeSocketServer);

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Connect to Redis and get the client instance
const redisClient = connectRedis();

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// 2. SOCKET.IO SETUP
// Initialize Socket.IO server and pass the Redis client
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:8080', // Replace with your actual frontend URL
        methods: ['GET', 'POST']
    }
});

// Pass the io and redisClient to a dedicated service for handling socket connections and game logic
initializeSocketServer(io, redisClient); 


// 3. MIDDLEWARE SETUP
// Enable CORS for frontend communication (adjust origin in production)
app.use(cors());

// Body parser - allows the server to read JSON from incoming requests
app.use(express.json());

// 4. DEFINE API ROUTES
// These routes handle RESTful API calls
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users')); 
app.use('/api/posts', require('./routes/posts')); // Planned

// 5. PROTECTED ROUTE EXAMPLE (Testing the middleware)
app.get('/api/protected', protect, (req, res) => {
    // This route is only accessible if the JWT is valid
    res.json({ message: 'Welcome to the protected zone!', user: req.user.username });
});

// 6. BASIC ROOT ROUTE TEST
app.get('/', (req, res) => {
    res.send('SocioSphere API is running and socket server is ready.');
});

// 7. START SERVER
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || "development";

// Start the HTTP server (which handles both Express and Socket.IO)
server.listen(PORT, () => 
    console.log(`🚀 Server running in ${MODE} mode on port ${PORT}`)
);
