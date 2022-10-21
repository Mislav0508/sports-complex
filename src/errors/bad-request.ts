import StatusCodes = require('http-status-codes');
import CustomAPIError from "./custom-api"

class BadRequest extends CustomAPIError {
  statusCode: number
  errorMessage: string
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.errorMessage = message
  }  
}

export default BadRequest;