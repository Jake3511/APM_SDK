const APM = require("./apm"); // Import your APM class

const apm = new APM("TestService", "http://localhost:3000", "https://api.diveharder.com/v1/store_rotation");

// Test getCPUUsage
console.log("CPU Usage Test:");
console.log(APM.getCPUUsage());

// Test API Latency and API Status
(async () => {
    console.log("\nAPI Latency Test:");
    const latencyResult = await apm.getAPILatency();
    console.log(latencyResult);
    
    console.log("\nAPI Status Test:");
    const statusResult = await apm.checkAPIStatus();
    console.log(statusResult);
})();

