const CrudRepository = require("./crud-repository");
const { Airplane } = require("../models/index.js");

class AirplaneRepository extends CrudRepository { 
    constructor() {
        super(Airplane);
    }
}

module.exports = AirplaneRepository;