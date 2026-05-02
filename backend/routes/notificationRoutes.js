const express = require("express");
const router = express.Router();
const Log = require("../logging_middleware/logging");


const notifications = [
    { id: 1, type: "info", message: "Welcome!", priority: 3, timestamp: Date.now() },
    { id: 2, type: "alert", message: "System issue", priority: 1, timestamp: Date.now() },
    { id: 3, type: "info", message: "Update available", priority: 2, timestamp: Date.now() },
    { id: 4, type: "alert", message: "Security warning", priority: 1, timestamp: Date.now() },
    { id: 5, type: "info", message: "Profile updated", priority: 4, timestamp: Date.now() },
    { id: 6, type: "alert", message: "Payment pending", priority: 2, timestamp: Date.now() },
    { id: 7, type: "info", message: "New message received", priority: 3, timestamp: Date.now() },
    { id: 8, type: "alert", message: "Password change required", priority: 1, timestamp: Date.now() },
    { id: 9, type: "info", message: "Backup completed", priority: 5, timestamp: Date.now() },
    { id: 10, type: "alert", message: "Storage limit warning", priority: 2, timestamp: Date.now() }
];


router.get("/", (req, res) => {
    try {
        Log("backend", "info", "route", "Fetching all notifications");

        res.json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        Log("backend", "error", "route", "Error fetching notifications");

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.get("/priority", (req, res) => {
    try {
        Log("backend", "info", "route", "Fetching priority notifications");

        const n = req.query.n === undefined ? 10 : Number.parseInt(req.query.n, 10);

        if (isNaN(n) || n <= 0) {
            Log("backend", "warn", "route", "Invalid query parameter n");

            return res.status(400).json({
                success: false,
                message: "Invalid value for n"
            });
        }

        
        const sorted = notifications
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .slice(0, n);

        Log("backend", "debug", "route", "Notifications fetched successfully");

        res.json({
            success: true,
            count: sorted.length,
            data: sorted
        });

    } catch (err) {
        Log("backend", "error", "route", "Error fetching notifications");

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;
