const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { message } = require("../utils/common/error-response");
const inMem = {};
async function createBooking(req, res) {
  try {
    console.log(req.body);
    const response = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.data = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
async function makePayment(req, res) {
  try {
    const idempotencyKey = req.headers["x-idempotency-key"];
    if (!idempotencyKey) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "idempotency key is missing" });
    }
    if (inMem[idempotencyKey]) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot retry on a successful payment",
      });
    }
    // console.log(req.body);
    const response = await BookingService.makePayment({
      totalCost: req.body.totalCost,
      userId: req.body.userId,
      bookingId: req.body.bookingId,
    });
    inMem[idempotencyKey] = idempotencyKey;
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.data = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
module.exports = {
  createBooking,
  makePayment,
};
