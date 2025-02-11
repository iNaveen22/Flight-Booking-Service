const express = require("express");

const {InfoController} = require("../../controllers");
const airplaneRoutes = require("./airplane-routes");

const v1router = express.Router();

v1router.use("/airplanes", airplaneRoutes);

v1router.get("/info", InfoController.info);

module.exports = v1router;
