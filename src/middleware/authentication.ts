import CustomError from "../errors"
import { StatusCodes } from "http-status-codes"
import { isTokenValid } from "../utils"
import { Request, Response, NextFunction } from "express"
import { attachCookiesToResponse } from "../utils"
import { Token } from "../models/Token"

declare module 'express-serve-static-core' {
  interface Request {
    user?: object
  }
}

const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken, accessToken } = req.signedCookies
  
  try {
    if (accessToken) {

      const payload: any = isTokenValid(accessToken)
      
      req.user = payload as any
      
      return next()
    }
    
    // payload was created in attachCookiesToResponse with createJWT 
    const payload: any = isTokenValid(refreshToken) 

    const existingToken = await Token.findOne({
      user: payload.user.IDUser,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.Unauthenticated('Authentication Invalid');
    }

    // create cookies again
    attachCookiesToResponse({res, user: payload.user, refreshToken: existingToken.refreshToken})

    req.user = payload.user as any
    next()
    
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
};

const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes("admin")) {
      throw new CustomError.Unauthorized(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

export {
  authenticateUser,
  authorizePermissions,
};