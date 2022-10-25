import { TokenUserInterface } from "./src/types/Utils"

declare global {
  namespace Express {
    export interface Request {
      user?: TokenUserInterface
    }
  }
}

