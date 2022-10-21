export interface UserInterface {
  email: string;
  password: string;
  role: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken: string;
  passwordTokenExpirationDate: Date;
  comparePassword: (candidatePassword: string) => boolean
}

export interface TokenInterface {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: object;
}
