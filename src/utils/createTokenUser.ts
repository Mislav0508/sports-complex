import { Types } from "mongoose"

const createTokenUser = (IDUser: Types.ObjectId, email: string, role: string, isVerified: boolean) => {
  return { IDUser, email, role, isVerified };
};

export default createTokenUser;