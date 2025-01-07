const CrudRepository = require("./crud-repository");
const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");
const { Op } = require("sequelize");
const { Enums } = require("../utils/common");
const { CANCELLED, PENDING, BOOKED, INITIATED } = Enums.BOOKING_STATUS;

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
  async cancelOldBookings(timestamp) {
    const response = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                [Op.not]: [BOOKED],
              },
            },
            {
              status: {
                [Op.ne]: [CANCELLED],
              },
            },
          ],
        },
      }
    );
    return response;
  }
}
module.exports = BookingRepository;
