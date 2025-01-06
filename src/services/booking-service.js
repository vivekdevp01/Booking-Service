const axios = require("axios");

const { BookingRepository } = require("../repositories");
const { ServerConfig } = require("../config");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
async function createBooking(data) {
  return new Promise((resolve, reject) => {
    const result = db.sequelize.transaction(async function bookingImpl(t) {
      console.log("booking");
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      const flightData = flight.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        reject(
          new AppError(
            "no of seats exceeds available seats",
            StatusCodes.BAD_REQUEST
          )
        );
      }
      console.log(flight.data);
      resolve(true);
    });
  });
}
module.exports = { createBooking };
