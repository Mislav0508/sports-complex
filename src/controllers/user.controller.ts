import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { SportClass } from "../models/SportClass"
import { User } from "../models/User"
import { SportClassInterface, UserInterface } from "../types/Models"

const getAllClasses = async (req: Request, res: Response) => {
  const { role } = req.body 

  try {
    let sportClasses: SportClassInterface[]

    if (role === "admin") {

      sportClasses = await SportClass.find()

    } else {

      sportClasses = await SportClass.find().select(['-comments', '-ratings', '-averageRating', '-_id', '-enrolledUsers'])      
    }

    res.status(StatusCodes.OK).json({sportClasses, total: sportClasses.length})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const getClassById = async (req: Request, res: Response) => {
  const { role } = req.body

  const classId: string = req.params.id

  try {
    let sportClass: SportClassInterface

    if (role === "admin") {

      sportClass = await SportClass.findById(classId)
    } else {
      
      sportClass = await SportClass.findById(classId).select(['-comments', '-ratings', '-averageRating', '-_id', '-enrolledUsers'])      
    }

    res.status(StatusCodes.OK).json({sportClass})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const filterClasses = async (req: Request, res: Response) => {
  const { role } = req.body

  const { sports, age } = req.query  

  try {
    let sportClass: SportClassInterface[]

    if (role === "admin") {

      sportClass = await SportClass.find({
        $or: [
          {sport: { $in: (<string>sports).split(",") }},
          {ageGroup: { $in: (<string>age).split(",") }}
        ]
      })

    } else {

      sportClass = await SportClass.find({
        $or: [
          {sport: { $in: (<string>sports).split(",") }},
          {ageGroup: { $in: (<string>age).split(",") }}
        ]
      }).select(['-comments', '-ratings', '-averageRating', '-_id', '-enrolledUsers'])      
    }

    res.status(StatusCodes.OK).json({sportClass, total: sportClass.length})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const rateClass = async (req: Request, res: Response) => {

  const sportClassId: string = req.params.id
  const { email, rating } = req.body
  
  try {

    const user: UserInterface = await User.findOne({email: email}) 
    const sportClass: SportClassInterface = await SportClass.findById(sportClassId)
    
    // Check if the user already gave a rating for this class.
    function userExists(user) {
      return sportClass.ratings.some(function(el) {
        return el.ratedBy.equals(user._id);
      }); 
    }
    const alreadyExists = userExists(user)
    
    if (alreadyExists) {

      await SportClass.findOneAndUpdate(
        { _id: sportClassId, 'ratings.ratedBy': user._id },
        {
          $set: {
            'ratings.$.rating': rating
          }
        },
      ) 

      await SportClass.updateMany({}, [{$set: {averageRating: {$avg: "$ratings.rating"}}}])
       
      res.status(StatusCodes.OK).send({msg: "Your rating has been updated!"})
      return

    } else {  // If user is giving a rating for the first time for this class.
      
      sportClass.ratings.push({rating: rating, ratedBy: user._id})
      
      sportClass.save()  

      await SportClass.updateMany({}, [{$set: {averageRating: {$avg: "$ratings.rating"}}}])
      
      res.status(StatusCodes.OK).send({msg: "Your rating has been stored!"}) 
    }    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
}

const commentClass = async (req: Request, res: Response) => {
  const sportClassId: string = req.params.id
  const { email, comment } = req.body

  try {
    const user: UserInterface = await User.findOne({email: email})
    const sportClass: SportClassInterface = await SportClass.findById(sportClassId)

    // Check if the user already gave a comment for this class.
    function userExists(user) {
      return sportClass.comments.some(function(el) {
        return el.commentedBy.equals(user._id);
      }); 
    }
    const alreadyExists = userExists(user)

    if (alreadyExists) {

      await SportClass.findOneAndUpdate(
        { _id: sportClassId, 'comments.commentedBy': user._id },
        {
          $set: {
            'comments.$.comment': comment
          }
        },
      ) 
       
      res.status(StatusCodes.OK).send({msg: "Your comment has been updated!"})
      return

    } else {  // If user is giving a comment for the first time for this class
      
      sportClass.comments.push({comment: comment, commentedBy: user._id})
      
      sportClass.save()  
      
      res.status(StatusCodes.OK).send({msg: "Your comment has been stored!"}) 
    } 
 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
}

const enrollUser = async (req: Request, res: Response) => {

  const sportClassId: string = req.params.id
  const { email } = req.body

  try {
    const user: UserInterface = await User.findOne({email: email})    
    
    const sportClass = await SportClass.findById(sportClassId)

    if(user.enrolledClasses.length > 1) {
      res.status(StatusCodes.OK).send({msg: "You are allowed to enroll in maximum 2 classes."})
      return
    }

    if(sportClass.enrolledUsers.includes(user._id)) {
      res.status(StatusCodes.OK).send({msg: "You are already enrolled in this class."})
      return
    }
    
    if(sportClass.enrolledUsers.length > 9) {
      res.status(StatusCodes.OK).send({msg: "Sorry, this class is full."})
      return
    }
    
    user.enrolledClasses.push(sportClass._id)
    await user.save()

    sportClass.enrolledUsers.push(user._id)
    await sportClass.save()


    res.status(StatusCodes.OK).send({msg: "You have been successfully enrolled in the class!"})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const unEnrollUser = async (req: Request, res: Response) => {

  const sportClassId: string = req.params.id
  const { email } = req.body

  try {
    const user: UserInterface = await User.findOne({email: email}) 

    await User.findOneAndUpdate({ email: email }, { $pull: {enrolledClasses: sportClassId} })

    await SportClass.findOneAndUpdate({ _id: sportClassId }, { $pull: {enrolledUsers: user._id} })

    res.status(StatusCodes.OK).send({msg: "You have been unenrolled from this class."})
  } catch (error) { 
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
}


export {
  getAllClasses,
  getClassById,
  filterClasses,
  enrollUser,
  unEnrollUser,
  rateClass,
  commentClass
}