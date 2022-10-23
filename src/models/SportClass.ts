import { Schema, model, Types } from 'mongoose'
import { SportClassInterface } from "../types/Models"


const ClassSchema = new Schema<SportClassInterface>({
  sport: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  enrolledUsers: {
    type: [{type: Types.ObjectId, ref: 'User'}],
    default: []
  }, 
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  comments: {
    type: [{
      comment: String,
      commentedBy: {type: Types.ObjectId, ref: 'User'}
    }]
  },
  ratings: {
    type: [{
      rating: Number,
      ratedBy: {type: Types.ObjectId, ref: 'User'}
    }]
  },
  averageRating: Number
});


export const SportClass = model<SportClassInterface>('SportClass', ClassSchema)


