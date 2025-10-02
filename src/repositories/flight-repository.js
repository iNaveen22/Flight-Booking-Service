const { Sequelize } = require("sequelize");

const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport } = require("../models/index.js");
const { where } = require("sequelize");
const db = require('../models');
const { addRowLockOnFlights } = require("./queries.js")

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    async getAllFlights(filter, sort) {
        const response = await Flight.findAll({
            where: filter,
            order: sort,
            include: [
                {
                    model: Airplane,
                    required: true,
                    as: 'airplane_detail'
                },
                {
                    model: Airport,
                    required: true,
                    as: 'Departure_Airport',
                    on: {
                        col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"), "=", Sequelize.col("Departure_Airport.code"))
                    }
                },
                {
                    model: Airport,
                    required: true,
                    as: 'Arrival_Airport',
                    on: {
                        col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), "=", Sequelize.col("Arrival_Airport.code"))
                    }
                }
            ]
        });
        return response;
    }

    async updateRemainingSeats(flightId, seats, dec = true) {
        const transaction = await db.sequelize.transaction();
        try {
            await db.sequelize.query(addRowLockOnFlights(flightId));
            const flight = await Flight.findByPk(flightId);
            if (+dec) {
                await flight.decrement('totalSeats', { by: seats });
            } else {
                await flight.increment('totalSeats', { by: seats });
            }
            await transaction.commit();
            return flight;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }


}

module.exports = FlightRepository;