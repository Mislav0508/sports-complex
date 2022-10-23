import jwt from "jsonwebtoken"
import { Response } from "express"


const createJWT = ({ payload } : { payload: object}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string)
  return token
}

const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string)

const attachCookiesToResponse = ({ res, user, refreshToken } : { res:Response, user: object, refreshToken: string}) => {
  
  const accessTokenJWT = createJWT({ payload: user });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })

  const halfHour = 1000 * 60 * 30;
  const twoHundredDays = 1000 * 60 * 60 * 24 * 200;

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