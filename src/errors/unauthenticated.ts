import StatusCodes = require('http-status-codes');
import CustomAPIError from "./custom-api"

class Unauthenticated extends CustomAPIError {
  statusCode: number
  errorMessage: string
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.errorMessage = message
  }
}

export default Unauthenticated;