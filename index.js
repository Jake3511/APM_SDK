const express = require("express");
const axios = require("axios");

class APM {
    constructor(serviceName, backendURL, apiURL, apiSecretKey) {
        this.serviceName = serviceName;
        this.backendURL = backendURL;
        this.apiURL = apiURL;
        this.apiSecretKey = apiSecretKey;
    }
    static getCPUUsage () {
        const totalMemory = os.totalMemory();
        const freeMemory = os.freeMemory();
        const usedMemory = totalMemory - freeMemory;
        const memory = ((totalMemory / usedMemory) * 100).toFixed(2);

        return {
            memory: $`{memory}`,
            cpuLoad: os.loadavg().toFixed(2)
        }
    }
    async getAPILatency (apiRUL, apiSecretKey) {
        try {
            const startTime = performance.now();
            await axios.get(apiKey, {
                headers: {"x-api-key": apiKey},
            });
            const endTime = performance.now();
            const latency = (endTime - startTime).toFixed(2);
            return {success: true, latency: `${latency}ms`};
        } 
        catch(error) {
            return {success: false, error: error.message};
        }
    }
}

