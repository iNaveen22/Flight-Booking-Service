const express = require("express");

const { AirportController } = require("../../controllers");
const { AirportMiddlewares } = require("../../middlewares");

const router = express.Router();

// /api/v1/airports POST
router
    .post("/", 
        AirportMiddlewares.validateCreateRequest,
        AirportController.createAirport
    );

// /api/v1/airports Get
router.get("/", AirportController.getAirports);

// /api/v1/airports/:id  Get
router.get("/:id", AirportController.getAirport);

// /api/v1/airports/:id  Delete
router.delete("/:id", AirportController.destroyAirport);

// /api/v1/airports/:id Patch
router.patch("/:id", AirportController.updateAirport);

module.exports = router;