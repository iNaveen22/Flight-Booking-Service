const express = require("express");

const {InfoController} = require("../../controllers");
const airplaneRoutes = require("./airplane-routes");
const cityRoutes = require("./city-routes")

const v1router = express.Router();

v1router.use("/airplanes", airplaneRoutes);

v1router.get("/info", InfoController.info);

v1router.use("/city",cityRoutes);

module.exports = v1router;
