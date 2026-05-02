require("dotenv").config();
const express = require("express");
const Log = require("./backend/logging_middleware/logging");

const app = express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Routes
const routes = require("./backend/routes/testRouters");
app.use("/api", routes);

// Health check endpoint
app.get("/", (req, res) => {
    // Send response immediately without waiting for logging
    res.send("Backend service running");
    // Log in background after response
    Log("backend", "debug", "route", "Health check endpoint accessed");
});

// Global error handler
app.use((err, req, res, next) => {
    Log(
        "backend",
        "error",
        "route",
        `Unhandled error: ${err.message}`
    );

    console.error("Unhandled Application Error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Handle unhandled rejections and errors BEFORE starting server
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit - let the server keep running
});

// Port setup
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`);
});

// Keep the process alive
setInterval(() => {
    // This keeps the event loop active
}, 1000);