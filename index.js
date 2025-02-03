const express = require("express");
const axios = require("axios");

class APM {
    constructor(serviceName, backendURL) {
        this.serviceName = serviceName;
        this.backendURL = backendURL;
    }
}