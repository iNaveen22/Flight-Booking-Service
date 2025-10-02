'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Airplane, {
        foreignKey: 'airplaneId',
        as: 'airplane_detail'
      });

      this.belongsTo(models.Airport, {
        foreignKey: 'departureAirportId',
        as: 'Departure_Airport'
      });

      this.belongsTo(models.Airport, {
        foreignKey: 'arrivalAirportId',
        as: 'Arrival_Airport'
      });
    }
  }
  Flight.init({
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airplaneId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    recurrence: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'ONCE'),
    allowNull: false,
    defaultValue: 'ONCE'
  },

  // NEW: start and end dates for the schedule
  startDate: {
    type: DataTypes.DATEONLY,  // e.g., '2025-10-01'
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,  // optional, e.g., '2025-12-31'
    allowNull: true
  },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    boardingGate: {
      type: DataTypes.STRING
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};