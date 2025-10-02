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
        console.log(error);
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
  const endingTripTime = " 23:59:59";

  if (query.trips) {
    [departureAirportId, arrivalAirportId] = query.trips.split("-");
    customFilter.departureAirportId = departureAirportId;
    customFilter.arrivalAirportId = arrivalAirportId;
  }

  if (query.trevellers) {
    customFilter.totalSeats = { [Op.gte]: query.trevellers };
  }

  if (query.tripDate) {
    customFilter[Op.or] = [
      {
        // Flights that run ONCE on that date
        [Op.and]: [
          { recurrence: 'ONCE' },
          { startDate: query.tripDate }
        ]
      },
      {
        // Flights that run DAILY or WEEKLY
        [Op.and]: [
          { recurrence: { [Op.in]: ['DAILY', 'WEEKLY'] } },
          { startDate: { [Op.lte]: query.tripDate } },
          {
            [Op.or]: [
              { endDate: { [Op.gte]: query.tripDate } },
              { endDate: null }
            ]
          }
        ]
      }
    ];
  }

  if (query.sort) {
    const params = query.sort.split(',');
    const sortFilters = params.map(param => param.split("_"));
    sortFilter = sortFilters;
  }

  try {
    const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
    return flights;
  } catch (error) {
    throw new AppError(['cannot fetch data of all the flights'], StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


async function getFlight(id){
    try {
        const flight = await flightRepository.get(id);
        return flight;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The flight you requested is not present', error.statusCode)
        }
        throw new AppError('Cannot fatch data of flight', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateSeats(data){
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError('Cannot update data of flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}