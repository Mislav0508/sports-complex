import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { SportClass } from "../models/SportClass"
import { User } from "../models/User"

const createClass = async (req: Request, res: Response) => {
  const { sport, ageGroup, startTime, duration, comments } = req.body  
  
  try {

    await SportClass.create({
      sport, 
      ageGroup, 
      startTime,
      duration,
      comments
    })

    res.status(StatusCodes.CREATED).send({ 
      msg: "Success! Class has been created."
    })    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const updateClass = async (req: Request, res: Response) => {
  const classId: string = req.params.id
  const { sport, ageGroup, startTime, duration, enrolledUsersIds, comments, ratings } = req.body  
  
  try {

    await SportClass.findOneAndUpdate({_id: classId}, {
      sport, 
      ageGroup, 
      startTime,
      duration,
      enrolledUsersIds,
      comments,
      ratings
    })

    res.status(StatusCodes.OK).send({ 
      msg: "Success! Class has been updated."
    })    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const deleteClass = async (req: Request, res: Response) => {
  const classId: string = req.params.id 
  
  try {

    await SportClass.findByIdAndRemove(classId)

    res.status(StatusCodes.OK).send({ 
      msg: "Success! Class has been deleted."
    })    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const createUser = async (req: Request, res: Response) => {
  const { email, password, role, isVerified } = req.body

  try {
    const user = await User.create({
      email, 
      password, 
      role, 
      isVerified
    })

    res.status(StatusCodes.CREATED).send({ 
      msg: "Success! User has been created.",
      user
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  
  try {

    const users = await User.find()

    res.status(StatusCodes.OK).json({users, total: users.length})    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const getUserById = async (req: Request, res: Response) => {
  const userId: string = req.params.id
  
  try {

    const user = await User.findById(userId)

    res.status(StatusCodes.OK).json({user})    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const updateUser = async (req: Request, res: Response) => {
  const userId: string = req.params.id
  const { email, password, role, isVerified, enrolledClasses } = req.body  
  
  try {

    await User.findOneAndUpdate({_id: userId}, {
      email,
      password,
      role,
      isVerified,
      enrolledClasses
    })

    res.status(StatusCodes.OK).send({msg: "Success! User has been updated."})    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const deleteUser = async (req: Request, res: Response) => {
  const userId: string = req.params.id
  
  try {

    await User.findByIdAndRemove(userId)

    res.status(StatusCodes.OK).send({msg: "Success! User has been deleted."})    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

export {
  createClass,
  updateClass,
  deleteClass,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}