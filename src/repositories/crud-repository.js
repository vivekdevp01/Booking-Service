// const { where } = require("sequelize");
const { Logger } = require("sequelize/lib/utils/logger");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
class CrudRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    const response = await this.model.create(data);
    return response;
  }
  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if (!response) {
      throw new AppError(
        "Couldn't find the given id airplane",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
  async get(id) {
    const response = await this.model.findByPk(id);
    if (!response) {
      throw new AppError(
        "Couldn't find the given id airplane",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
  async getAll() {
    const response = await this.model.findAll();
    return response;
  }
  async update(id, data) {
    const existingresponse = await this.model.findByPk(id);
    if (!existingresponse) {
      throw new AppError(
        "Couldn't find the given id airplane",
        StatusCodes.NOT_FOUND
      );
    }
    const response = await this.model.update(data, {
      where: {
        id: id,
      },
    });

    return response;
  }
}

module.exports = CrudRepository;
