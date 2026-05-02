const axios = require("axios");


const loggingClient = axios.create({
    baseURL: "http://20.207.122.201/evaluation-service",
    timeout: 5000  
});

loggingClient.interceptors.request.use((reqConfig) => {
    
    return reqConfig;
});


loggingClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const failedRequest = err.config;

        if (err.response?.status === 401 && !failedRequest.isRetryAttempt) {
            try {
                failedRequest.isRetryAttempt = true;

                const { requestTokenFromServer } = require("../services/auth_services");
                const refreshedToken = await requestTokenFromServer();
                failedRequest.headers.Authorization = `Bearer ${refreshedToken}`;

                return loggingClient(failedRequest);
            } catch (refreshErr) {
                console.warn("[logging] Failed to refresh token:", refreshErr.message);
                return Promise.reject(err);
            }
        }

        return Promise.reject(err);
    }
);


function Log(stack, level, pkg, message) {
    // fire-and-forget (do NOT block request)
    loggingClient.post("/logs", {
        stack,
        level,
        package: pkg,
        message
    }).catch(err => {
        // silently handle log failures to prevent crashes
    });
}

module.exports = Log;