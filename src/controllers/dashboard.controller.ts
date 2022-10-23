import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { SportClass } from "../models/SportClass"

const createClass = async (req: Request, res: Response) => {
  const { sport, ageGroup, startTime, duration } = req.body  
  
  try {

    await SportClass.create({
      sport, 
      ageGroup, 
      startTime,
      duration
    })

    res.status(StatusCodes.CREATED).json({ 
      msg: "Success! Class has been created."
    })    

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

export {
  createClass
}