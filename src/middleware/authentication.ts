import CustomError from "../errors"
import { StatusCodes } from "http-status-codes"
import { isTokenValid } from "../utils"
import { Request, Response, NextFunction } from "express"
import { attachCookiesToResponse } from "../utils"
import { Token } from "../models/Token"
import { TokenUserInterface } from "../types/Utils"
import { JwtPayload } from "jsonwebtoken"

const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken, accessToken } = req.signedCookies
  
  try {
    // first look for the access token
    if (accessToken) {

      const payload = isTokenValid(accessToken)
      
      req.user = payload as TokenUserInterface
      
      return next()
    }
    
    // If no accessToken then search for refreshToken
    
    // payload was created in attachCookiesToResponse with createJWT 
    const payload = isTokenValid(refreshToken) as JwtPayload 

    const existingToken = await Token.findOne({
      user: payload.user.IDUser,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.Unauthenticated('Authentication Invalid')
    }

    // create cookies again
    attachCookiesToResponse({res, user: payload.user, refreshToken: existingToken.refreshToken})

    req.user = payload.user as any
    next()
    
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: "Please sign in."})
  }
};

const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let user = req.user as TokenUserInterface
    
    if (!roles.includes(user.role)) {
      throw new CustomError.Unauthorized(
        'Unauthorized to access this route'
      )
    }
    next()
  };
};

export {
  authenticateUser,
  authorizePermissions,
};