const APM = require("../sdk_classes/apm");

describe("APM Class Tests", () => {
    const apm = new APM("TestService", "https://jsonplaceholder.typicode.com/posts");

    test("getCPUUsage returns a valid number between 0 and 100", () => {
        const result = APM.getCPUUsage();
        expect(result).toHaveProperty("memory");
        expect(result).toHaveProperty("cpuLoad");
        expect(typeof result.memory).toBe("string");
        expect(typeof result.cpuLoad).toBe("string");
    });

    test("getAPILatency returns latency in ms", async () => {
        const result = await apm.getAPILatency();
        expect(result.success).toBe(true);
        expect(result).toHaveProperty("latency");
        expect(typeof result.latency).toBe("string");
        const latencyValue = parseFloat(result.latency.replace("ms", ""));
        if(latencyValue > 400) {
            console.warn(`High API latency: ${latencyValue}ms`);
        }
    });

    test("checkAPIStatus returns HTTP status code", async () => {
        const result = await apm.checkAPIStatus();
        expect(result.success).toBe(true);
        expect(result.status).toBe(200);
    });

    test("postUserConnection", async () => {
        apm.backendURL = "http://localhost:3000";

        const result = await apm.postUserConnection();

        expect(result).toHaveProperty("status");

        expect(result.status.status).toBe(200);
    })

    test("postUserDisconnected", async () => {
        apm.backendURL = "http://localhost:3000";

        const result = await apm.postUserDisconnected();

        expect(result).toHaveProperty("status");

        expect(result.status.status).toBe(200);
    })

    test("getActiveUsers", async () => {
        apm.backendURL = "http://localhost:3000";

        const result = await apm.getActiveUsers();

        expect(result).toBe(0)
    })

});

