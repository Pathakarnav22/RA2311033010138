require("dotenv").config();
const express = require("express");
const Log = require("./backend/logging_middleware/logging");

const app = express();


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


const routes = require("./backend/routes/testRouters");
app.use("/api", routes);


const notificationRoutes = require("./backend/routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/notifications", notificationRoutes);


app.get("/", (req, res) => {
    
    res.send("Backend service running");
    
    Log("backend", "debug", "route", "Health check endpoint accessed");
});


app.use((req, res) => {
    Log("backend", "warn", "route", `Route not found: ${req.method} ${req.originalUrl}`);

    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});


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


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});


const PORT = process.env.PORT || 3001;

function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Server successfully started on port ${PORT}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use`);
        } else {
            console.error("Failed to start server:", error.message);
        }

        process.exit(1);
    });

    return server;
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
