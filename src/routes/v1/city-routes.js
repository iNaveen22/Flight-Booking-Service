const express = require("express");

const { CityController } = require("../../controllers");
const { CityMiddlewares } = require("../../middlewares");

const router = express.Router();

// /api/v1/city POST
router
    .post("/", 
        CityMiddlewares.validateCreateRequest,
        CityController.createCity
    );

// /api/v1/city Get
router.get("/", CityController.getCities);

// /api/v1/city/:id  Get
router.get("/:id", CityController.getCity);

// /api/v1/city/:id  Delete
router.delete("/:id", CityController.deleteCity);

// /api/v1/city/:id Patch
router.patch("/:id", CityController.updateCity);

module.exports = router;