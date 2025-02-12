const { where } = require("sequelize");
const { CityRepository } = require("../repositories");

const AppError = require("../utils/errors/app-error")
const {StatusCodes} = require("http-status-codes")

const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError([explanation], StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new City object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCities(){
    try {
        const cities = await cityRepository.getAll();
        return cities;
    } catch (error) {
        throw new AppError('Cannot fetch data of all cities', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCity(id){
    try {
        const city = await cityRepository.get(id);
        return city;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The City you requested is not present', error.statusCode);
        }
        throw new AppError('Cannot fetch data of city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function deleteCity(id) {
    try {
        const city = await cityRepository.destroy(id);
        return city;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The City you requested to delete is not present', error.statusCode);
        }
        throw new AppError('Cannot fetch data of all City', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updataCity(id, data) {
    try {
        const city = await cityRepository.get(id);
        if (!city) {
            throw new AppError('The City you requested to update is not present', StatusCodes.NOT_FOUND);
        }

        const updatedCity = await cityRepository.update(id, data);
        return updatedCity;
    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError('The City you requested to update is not present', error.statusCode);
        }
        throw new AppError('Cannot update the city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCity,
    deleteCity,
    updataCity,
    getCities,
    getCity
}