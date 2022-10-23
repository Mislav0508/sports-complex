import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { SportClass } from "../models/SportClass"
import { User } from "../models/User"

const getAllClasses = async (req: Request, res: Response) => {

  try {
    const sportClasses = await SportClass.find()

    res.status(StatusCodes.OK).json({sportClasses, total: sportClasses.length})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
}


const getClassById = async (req: Request, res: Response) => {

  const id: string = req.params.id

  try {
    const sportClass = await SportClass.findById(id)

    res.status(StatusCodes.OK).json({sportClass})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const filterClasses = async (req: Request, res: Response) => {

  const { sports, age } = req.query  

  try {
    const sportClass = await SportClass.find({
      $or: [
        {sport: { $in: (<string>sports).split(",") }},
        {ageGroup: { $in: (<string>age).split(",") }}
      ]
    })

    res.status(StatusCodes.OK).json({sportClass, total: sportClass.length})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const enrollUser = async (req: Request, res: Response) => {

  const sportClassId: string = req.params.id
  const { email } = req.body

  try {
    const user: any = await User.findOne({email: email})    
    
    const sportClass = await SportClass.findById(sportClassId)

    if(user.enrolledClasses.length > 2) {
      res.status(StatusCodes.OK).send({msg: "You are allowed to enroll in maximum 2 classes."})
    }

    if(sportClass.enrolledUsers.includes(user._id)) {
      res.status(StatusCodes.OK).send({msg: "You are already enrolled in this class."})
    }
    
    if(sportClass.enrolledUsers.length > 9) {
      res.status(StatusCodes.OK).send({msg: "Sorry, this class is full."})
    }
    
    user.enrolledClasses.push(sportClass._id)
    await user.save()

    sportClass.enrolledUsers.push(user._id)
    await sportClass.save()


    res.status(StatusCodes.OK).json({user, sportClass})  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const unEnrollUser = async (req: Request, res: Response) => {

  const sportClassId: string = req.params.id
  const { email } = req.body

  try {
    const user: any = await User.findOne({email: email})    
    
    const sportClass: any = await SportClass.findById(sportClassId)

    user.enrolledClasses.pull(sportClass._id)
    await user.save()

    sportClass.enrolledUsers.pull(user._id)
    await sportClass.save()

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
  unEnrollUser
}