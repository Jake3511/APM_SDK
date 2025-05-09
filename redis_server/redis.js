require("dotenv").config({ path: "../.env"})
const express = require('express');
const app = express();
const redis = require('redis');
const port = process.env.PORT || 3000;
const redisUrl = process.env.REDIS_URL;

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