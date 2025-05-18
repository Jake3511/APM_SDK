require("dotenv").config({ path: "../.env"})
const express = require('express');
const app = express();
const redis = require('redis');
const port = process.env.PORT || 3000;
const redisUrl = process.env.REDIS_URL;

app.use(express.json());
const client = redis.createClient({
    url: redisUrl
});
client.connect() 
.then (() => {
    console.log("Connected!"); 
}) 
.catch ((err) => { 
    console.log("Could not connect to redis: ", err); 
})

app.post("/user-connected", async (res, req) => {
    const { service } = req.body;
    await client.incr(`active_users:${service}`);
    res.sendStatus(200);
})

app.post("/user-disconnected", async (res, req) => {
    const { service } = req.body;
    await client.decr(`active_users:${service}`);
    res.sendStatus(200);
})

app.get("/active-users", async (res, req) => {
    const { service } = req.body;
    const count = await client.get(`active_users:${service}`) || 0;
    res.json({count: parseInt(count, 10)});
})

app.listen(port, () => {
    console.log(`APM backend running on port ${port}`);
})