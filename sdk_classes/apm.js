const axios = require("axios");
const { performance } = require('perf_hooks');
const os = require("os");

class APM { // Class to handle/create new variable that can be used to for monitoring CPU usage and API metrics (so far)
    #requestNumber = 0;
    constructor(serviceName, apiURL, apiKey = "", userApiKey="") {
        this.serviceName = serviceName;
        this.backendURL = "";
        this.apiURL = apiURL;
        this.apiKey = apiKey;
        this.userApiKey;
    }
    
    static getCPUUsage () { // function to get the CPU memory usage that your application could be using
        const totalMemory = os.totalmem(); // gets the total memory of the CPU
        const freeMemory = os.freemem(); // gets the total free memory of the CPU
        const usedMemory = totalMemory - freeMemory; // gets the total used memory by subtracting total by free memory
        const memory = ((totalMemory / usedMemory) * 100).toFixed(2); // gets the actual memory and formats it to be more readable
        
        return { // return function to 
            memory: `${memory}`,
            cpuLoad: os.loadavg()[0].toFixed(2)
        }
    }
    async getAPILatency () { // function to get check the api latency(delay) of an api using preformance module
        try {
            const startTime = performance.now(); // gets the current time of running function
            const headers = {}; // initially empty variable used to see if apiKey is something required

            if (this.apiKey) {
                headers["x-api-key"] = this.apiKey; // creates a header in order to check for the apiKey if one is required
            }

            await axios.get(this.apiURL, { headers }); // makes an API call

            const endTime = performance.now(); // gets the time after making the api call
            const latency = (endTime - startTime).toFixed(2); // a variable to get actual time it takes to complete an api call
            return {success: true, latency: `${latency}ms`}; // if successful, return the latency in millieseconds
        } 
        catch(error) {
            return {success: false, error: error.message}; // if not successful, return error message
        }
    }
    async postUserConnection () {
        try {
            const status = await axios.post(`${this.backendURL}/user-connected`, {
                service: this.serviceName
            });
            return {status};
        }
        catch (error) {
            console.log("Failed to connect to redis server(user-connected)!");
            return {error};
        }
    }

    async postUserDisconnected () {
        try {
            const status = await axios.post(`${this.backendURL}/user-disconnected`, {
                service: this.serviceName
            })
            return {status};
        }
        catch (error) {
            console.log("Failed to connect to redis server(user-disconnected)!");
            return {error};
        }
    }

    async getActiveUsers() {
        try {
            const response = await axios.get(`${this.backendURL}/active-users`, {
                params: {service: this.serviceName}
            })
            return response.data.count;
        }
        catch (error) {
            console.log("Failed to connect to redis(active-users)")
        }
    }

    async checkAPIStatus () { // function to check the status of api's, calls your api with a key or not
        const headers = {}
        if (this.apiKey) {
            headers["x-api-key"] = this.apiKey; // creates a header in order to check for the apiKey if one is required
        }

        try { // create a catch case where if the api response is successful, it returns a success
            const response = await axios.get(this.apiURL, { headers }); // save response of an api call in response to return status later
            console.log(`Request successful: ${response.status}`); // prints the response result

            // used for checking to see if a user is verified/authorized to upload to the dashboard
            if (this.userApiKey !== "") { 
                const postRes = await axios.post("", {
                    status: response.status,
                    url: this.apiURL
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": this.userApiKey
                    }
                });
            }

            return { success: true, status: response.status }; // returns the above result
        } 
        catch (error) {
            console.error(`Request failed: ${error.response ? error.response.status : error.message}`); 
            return { success: false, status: error.response ? error.response.status : "Network Error" }; // returns error message to caller
        }
    }
    
}
module.exports = APM;
