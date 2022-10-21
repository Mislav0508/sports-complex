import { Schema, model, Types } from 'mongoose'
import { TokenInterface } from "../types/Models"

const TokenSchema = new Schema<TokenInterface>(
  {
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Token = model<TokenInterface>('Token', TokenSchema)
