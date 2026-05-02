const express = require("express");
const router = express.Router();
const { testController } = require("../controllers/testController");
const Log = require("../logging_middleware/logging");

router.post("/validate", testController);

router.all("/validate", (req, res) => {
    Log("backend", "warn", "route", `Invalid method ${req.method}`);

    res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
    });
});

module.exports = router;