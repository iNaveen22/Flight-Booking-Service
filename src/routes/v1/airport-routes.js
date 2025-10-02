const express = require("express");

const { AirportController } = require("../../controllers");
const { AirportMiddlewares } = require("../../middlewares");
const { Airport } = require("../../models");

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

router.get("/code/:code",async(req,res)=>{
    try{
        const {code} = req.params;
       const airport = await Airport.findOne({where:{code}});
       if(!airport){
        return res.status(404).json({message:"Airport not found"});
       }
        res.status(200).json({airport});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal Server Error"});
    }
})



module.exports = router;