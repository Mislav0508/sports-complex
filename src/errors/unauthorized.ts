import StatusCodes = require('http-status-codes');
import CustomAPIError from "./custom-api"

class Unauthorized extends CustomAPIError {
  statusCode: number
  errorMessage: string
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.errorMessage = message
  }
}

export default Unauthorized;