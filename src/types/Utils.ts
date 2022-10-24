import { Types } from 'mongoose'

export interface TokenUserInterface {
  IDUser: Types.ObjectId,
  email: string,
  role: string,
  isVerified: boolean
}