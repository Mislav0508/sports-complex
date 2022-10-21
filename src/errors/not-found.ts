import StatusCodes = require('http-status-codes');
import CustomAPIError from "./custom-api"

class NotFound extends CustomAPIError {
  statusCode: number
  errorMessage: string
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.errorMessage = message
  }
}

export default NotFound;