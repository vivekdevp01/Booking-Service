const axios = require("axios");

const { BookingRepository } = require("../repositories");
const bookingRepository = new BookingRepository();
const { ServerConfig } = require("../config");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { Enums } = require("../utils/common");
const { CANCELLED, PENDING, BOOKED, INITIATED } = Enums.BOOKING_STATUS;
const { StatusCodes } = require("http-status-codes");
async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError(
        "no of seats exceeds available seats",
        StatusCodes.BAD_REQUEST
      );
    }
    const totalBillingAmount = data.noOfSeats * flightData.price;
    console.log(totalBillingAmount);
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.create(bookingPayload, transaction);
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );
    if (bookingDetails.status == CANCELLED) {
      throw new AppError("The booking has cancelled", StatusCodes.BAD_REQUEST);
    }
    console.log(bookingDetails);
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if (currentTime - bookingTime > 300000) {
      await bookingRepository.update(
        data.bookingId,
        { status: CANCELLED },
        transaction
      );
      throw new AppError("the booking was expired", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError(
        "the amount of payment not matched",
        StatusCodes.BAD_REQUEST
      );
    }
    if (bookingDetails.userId != data.userId) {
      throw new AppError(
        "The user is not authorized to",
        StatusCodes.BAD_REQUEST
      );
    }
    await bookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      transaction
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
module.exports = { createBooking, makePayment };
