const express = require("express");

const {InfoController} = require("../../controllers");
const airplaneRoutes = require("./airplane-routes");
const cityRoutes = require("./city-routes");
const airportRoutes = require("./airport-routes");
const flightRoutes = require("./flight-routes");

const v1router = express.Router();

v1router.use("/airplanes", airplaneRoutes);

v1router.get("/info", InfoController.info);

v1router.use("/city",cityRoutes);

v1router.use("/airports", airportRoutes);

v1router.use("/flights", flightRoutes);

module.exports = v1router;
