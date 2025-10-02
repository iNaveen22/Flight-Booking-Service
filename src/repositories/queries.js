function addRowLockOnFlights(flightId) {
    return `SELECT * from flights Where Flights.id = ${flightId} FOR UPDATE;`;
}

module.exports = {
    addRowLockOnFlights
}