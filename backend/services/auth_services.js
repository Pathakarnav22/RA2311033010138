const axios = require("axios");

let authTokenCache = null;
let tokenValidTill = null;

async function requestTokenFromServer() {
    try {
        const payload = {
            email: process.env.EMAIL,
            name: process.env.NAME,
            rollNo: process.env.ROLL_NO,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        };

        const result = await axios.post(
            "http://20.207.122.201/evaluation-service/auth",
            payload
        );

        authTokenCache = result.data.access_token;
        tokenValidTill = Date.now() + result.data.expires_in * 1000;

        return authTokenCache;

    } catch (error) {
        console.error("Token generation failed:", error.response?.data || error.message);
        throw error;
    }
}

async function retrieveToken() {
    const isExpired = !authTokenCache || Date.now() >= tokenValidTill;

    if (isExpired) {
        return await requestTokenFromServer();
    }

    return authTokenCache;
}

module.exports = { retrieveToken, requestTokenFromServer };