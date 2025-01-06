const CrudRepository = require("./crud-repository");
const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }
  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }
  async get(data, transaction) {
    const response = await this.model.findByPk(data, {
      transaction: transaction,
    });
    if (!response) {
      throw new AppError(
        "Couldn't find the given id airplane",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
  async update(id, data, transaction) {
    // const existingresponse = await this.model.findByPk(id);
    // if (!existingresponse) {
    //   throw new AppError(
    //     "Couldn't find the given id airplane",
    //     StatusCodes.NOT_FOUND
    //   );
    // }
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction }
    );

    return response;
  }
}
module.exports = BookingRepository;
