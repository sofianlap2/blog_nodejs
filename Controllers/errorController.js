const CustomError = require("../Utils/CustomError");

module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorStatus = error.status || "error";

  const environement = process.env.NODE_ENV;

  if (environement === "production") {
    //Handle undefined route id
    if (error.name == "CastError") {
      error = new CustomError(
        `There is no route with this id ${error.value}`,
        400
      );
    }

    //Handle duplicate key
    if (error.code == 11000) {
      const keyValue = Object.keys(error.keyValue)[0];
      error = new CustomError(
        `There is duplicate field with this value ${keyValue}`,
        400
      );
    }

    //Handle error mongoose validation
    if (error.name == "ValidationError") {
      const errorMessage = Object.values(error.errors).map(val => val.message)
      const errorMsgStr = errorMessage.join(', ')
      error = new CustomError(
        `There is validation error on this fields:  ${errorMsgStr}`,
        400
      );
    }

    res.status(statusCode).json({
      status: errorStatus,
      message: error.message,
    });
  } else {
    res.status(statusCode).json({
      status: errorStatus,
      message: error.message,
      errorStack: error.stack,
      error: error,
    });
  }
};
