const Log = require("../logging_middleware/logging");

async function testController(req, res) {
    try {
        
        Log("backend", "info", "handler", "Request received at testController");

        const { value } = req.body;

        
        if (typeof value !== "boolean") {
            Log(
                "backend",
                "error",
                "handler",
                "Validation failed: 'value' should be boolean"
            );

            return res.status(400).json({
                success: false,
                message: "Invalid input: value must be boolean"
            });
        }

       
        Log(
            "backend",
            "debug",
            "handler",
            "Valid boolean received, processing successful"
        );

        return res.status(200).json({
            success: true,
            data: value
        });

    } catch (error) {
        
        Log(
            "backend",
            "fatal",
            "handler",
            "Unhandled exception occurred in testController"
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { testController };