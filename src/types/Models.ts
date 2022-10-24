import { Types } from 'mongoose'

export interface UserInterface {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken: string;
  passwordTokenExpirationDate: Date;
  enrolledClasses: [Types.ObjectId];
  comparePassword: (candidatePassword: string) => boolean;
}

export interface TokenInterface {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: object;
}

export interface SportClassInterface {
  _id: Types.ObjectId;
  sport: string;
  ageGroup: string;
  enrolledUsers: [Types.ObjectId];
  startTime: Date;
  duration: number;
  comments: [{
    comment: string,
    commentedBy: Types.ObjectId
  }];
  ratings: [{
    rating: number,
    ratedBy: Types.ObjectId
  }];
  averageRating: number;
  save: () => void;
}
