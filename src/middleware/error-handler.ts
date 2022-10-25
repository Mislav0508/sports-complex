import StatusCodes from "http-status-codes"
import type { ErrorRequestHandler } from "express";


const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };
  
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors as object)
      .map((item) => item.message)
      .join(',') 
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;