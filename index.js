const express = require("express");
const axios = require("axios");
const { performance } = require('perf_hooks');

class APM { // Class to handle/create new variable that can be used to for monitoring CPU usage and API metrics (so far)
    constructor(serviceName, backendURL, apiURL, apiKey) {
        this.serviceName = serviceName;
        this.backendURL = backendURL;
        this.apiURL = apiURL;
        this.apiKey = apiKey;
    }
    static getCPUUsage () { // function to get the CPU memory usage that your application could be using
        const totalMemory = os.totalMemory(); // gets the total memory of the CPU
        const freeMemory = os.freeMemory(); // gets the total free memory of the CPU
        const usedMemory = totalMemory - freeMemory; // gets the total used memory by subtracting total by free memory
        const memory = ((totalMemory / usedMemory) * 100).toFixed(2); // gets the actual memory and formats it to be more readable

        return { // return function to 
            memory: `${memory}`,
            cpuLoad: os.loadavg().toFixed(2)
        }
    }
    async getAPILatency (apiURL, apiKey) { // function to get check the api latency(delay) of an api using preformance module
        try {
            const startTime = performance.now(); // gets the current time of running function
            const headers = {}; // initially empty variable used to see if apiKey is something required

            if (apiKey) {
                headers["x-api-key"] = apiKey; // creates a header in order to check for the apiKey if one is required
            }

            await axios.get(apiURL, headers); // makes an API call 

            const endTime = performance.now(); // gets the time after making the api call
            const latency = (endTime - startTime).toFixed(2); // a variable to get actual time it takes to complete an api call
            return {success: true, latency: `${latency}ms`}; // if successful, return the latency in millieseconds
        } 
        catch(error) {
            return {success: false, error: error.message}; // if not successful, return error message
        }
    }
}

