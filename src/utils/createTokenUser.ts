import { TokenUserInterface } from "../types/Utils"

const createTokenUser = (tokenUser: TokenUserInterface) => {
  return { 
    IDUser: tokenUser.IDUser, 
    email: tokenUser.email, 
    role: tokenUser.role, 
    isVerified: tokenUser.isVerified 
  }
}

export default createTokenUser