import jwt from "jsonwebtoken"
import { Response } from "express"
import { TokenUserInterface } from "../types/Utils"


const createJWT = ({ payload } : { payload: object}) => {
  const token: string = jwt.sign(payload, process.env.JWT_SECRET as string)
  return token
}

const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string)

const attachCookiesToResponse = ({ res, user, refreshToken } : { res: Response, user: TokenUserInterface, refreshToken: string}) => {
  
  const accessTokenJWT: string = createJWT({ payload: user });
  const refreshTokenJWT: string = createJWT({ payload: { user, refreshToken } })

  const halfHour: number = 1000 * 60 * 30;
  const twoHundredDays: number = 1000 * 60 * 60 * 24 * 200;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: false,
    maxAge: halfHour,
    secure: false,
    signed: true,
    expires: new Date(Date.now() + halfHour)
  });
  
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: false,
    maxAge: twoHundredDays,
    secure: false,
    signed: true,
    expires: new Date(Date.now() + twoHundredDays)
  })
}

export {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}