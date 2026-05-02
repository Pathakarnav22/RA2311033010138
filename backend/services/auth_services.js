const axios = require("axios");

let authTokenCache = null;
let tokenValidTill = null;
let isFetchingToken = false;

async function requestTokenFromServer() {
    if (isFetchingToken) {
        
        while (isFetchingToken) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return authTokenCache;
    }

    try {
        isFetchingToken = true;

        console.log("[auth_services] Requesting new access token");

        const result = await axios.post(
            "http://20.207.122.201/evaluation-service/auth",
            {
                email: process.env.EMAIL,
                name: process.env.NAME,
                rollNo: process.env.ROLL_NO,
                accessCode: process.env.ACCESS_CODE,
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            },
            { timeout: 5000 } 
        );

        authTokenCache = result.data.access_token;
        tokenValidTill = Date.now() + result.data.expires_in * 1000;

        console.log("[auth_services] Token generated and cached successfully");

        return authTokenCache;

    } catch (error) {
        console.error("Token generation failed:", error.message);
        throw error;
    } finally {
        isFetchingToken = false;
    }
}

async function retrieveToken() {
    // Wait if a token fetch is already in progress
    while (isFetchingToken) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
        const isExpired = !authTokenCache || Date.now() >= tokenValidTill;

        if (isExpired) {
            console.log("[auth_services] Token expired or missing, generating new token");
            return await requestTokenFromServer();
        }

        console.log("[auth_services] Using cached access token");

        return authTokenCache;

    } catch (error) {
        console.error("[auth_services] Critical failure in retrieveToken:", error.message);
        throw error;
    }
}

module.exports = { retrieveToken, requestTokenFromServer };