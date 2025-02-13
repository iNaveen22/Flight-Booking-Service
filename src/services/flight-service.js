const { FlightRepository } = require("../repositories");
const { Op } = require("sequelize");

const AppError = require("../utils/errors/app-error")
const {StatusCodes} = require("http-status-codes");
const { compareTime } = require("../utils/helpers/datetime-helpers");

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        const { departureTime, arrivalTime } = data;

        if (!compareTime(departureTime, arrivalTime)) {
            throw new AppError(['Departure time cannot be greater than arrival time'], StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if(error.name == 'SequelizeValidationError'){
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError([explanation], StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    let endingTripTime = " 23:59:59";
    if(query.trips){
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }

    if(query.price){
        [minPrice, maxPrice] = query.price.split("-");
        customFilter.price = {
            [Op.between]: [minPrice, ((maxPrice == undefined) ? 9999 : maxPrice)]
        }
    }

    if(query.trevellers){
        customFilter.totalSeats = {
            [Op.gte]: query.trevellers
        }
    }

    if(query.tripDate){
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + endingTripTime]
        }
    }

    if(query.sort){
        const params = query.sort.split(','); 
        const sortFilters = params.map((param) => param.split("_"));
        sortFilter = sortFilters;
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        throw new AppError(['cannot fatch data of all the flights'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getAllFlights
}