import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { User } from "../models/User"
import { Token } from "../models/Token"
import { createTokenUser, attachCookiesToResponse, sendVerificationEmail, sendResetPasswordEmail } from "../utils"
import crypto from "crypto"
import { TokenUserInterface } from "../types/Utils"



const register = async (req: Request, res: Response) => {
  const { email, password } = req.body
  
  try {
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
      throw new CustomError.BadRequest("Email already exists")
    }

    // first registered user is an admin
    const isFirstAccount: boolean = (await User.countDocuments({})) === 0
    const role: string = isFirstAccount ? 'admin' : 'user'

    const verificationToken: string = crypto.randomBytes(40).toString("hex")

    const user = await User.create({
      email,
      password,
      role,
      verificationToken,
    })

    await sendVerificationEmail(user.verificationToken, user.email)

    res.status(StatusCodes.CREATED).send({ 
      msg: "Success! Please check your email to verify account."
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body
  
  try {
    const user = await User.findOne({ email })
  
    if (!user) {
      throw new CustomError.Unauthorized("User doesn't exist")
    }

    if (user.verificationToken !== verificationToken) {
      throw new CustomError.Unauthorized("Verification failed")
    }

    (user.isVerified = true), (user.verified = Date.now() as any)
    user.verificationToken = ''

    await user.save()

    res.status(StatusCodes.OK).send({msg: "Email verified"})

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      throw new CustomError.BadRequest('Please provide email and password')
    }

    const user = await User.findOne({ email })
    
    if (!user) {
      throw new CustomError.Unauthenticated("User doesn't exist")
    }

    const isPasswordCorrect: boolean = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      throw new CustomError.Unauthenticated('Invalid Credentials')
    }

    if (!user.isVerified) {
      throw new CustomError.Unauthenticated('User not verified.')
    }

    let tokenUserProperties: TokenUserInterface = {
      IDUser: user._id, 
      email: email, 
      role: user.role, 
      isVerified: user.isVerified
    }
     
    // basic user info object
    const tokenUser = createTokenUser(tokenUserProperties)

    // create refresh token
    let refreshToken: string = ""

    // check for existing token
    const existingToken = await Token.findOne({ user: user._id })

    if (existingToken) {
      const { isValid } = existingToken
      if (!isValid) {
        throw new CustomError.Unauthenticated("Invalid credentials.")
      }
      refreshToken = existingToken.refreshToken
      attachCookiesToResponse({ res, user: tokenUser, refreshToken })
      res.status(StatusCodes.OK).json({ user: tokenUser })
      return
    }    

    // if no existing token
    refreshToken = crypto.randomBytes(40).toString("hex")
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = { refreshToken, ip, userAgent, user: user._id }

    await Token.create(userToken)

    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
  
    res.status(StatusCodes.OK).json({ user: tokenUser })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }
  
}

const logout = async (req: Request, res: Response) => {

  try {
    await Token.findOneAndDelete({ user: req.user.IDUser })

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now())
    })
    
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now())
    })

    res.status(StatusCodes.OK).send({ msg: 'user logged out!' })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

// Get reset password link per email. The link builds a query with the passwordToken and email from the logged in user. 
const forgotPassword = async (req: Request, res: Response) => {

  try {
    const { email } = req.body

    if (!email) {
      throw new CustomError.BadRequest("Please provide valid email")
    }

    const user = await User.findOne({ email })

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex")

      // send email
      await sendResetPasswordEmail(passwordToken, user.email)

      const tenMinutes: number = 1000 * 60 * 10
      const passwordTokenExpiration: Date = new Date(Date.now() + tenMinutes)

      user.passwordToken = crypto.createHash('md5').update(passwordToken).digest('hex')
      user.passwordTokenExpirationDate = passwordTokenExpiration
      await user.save()
    }

    // Regardless if email exist, we send a success msg so the attacker doesn't know if the email exists.
    res.status(StatusCodes.OK).send({ msg: "Please check your email for reset password link" })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

// Retrieve passwordToken and email from the url params which will get built once we click the email link that we received. After that, setup enter new email on the frontend.
const resetPassword = async (req: Request, res: Response) => {

  try {
    const { passwordToken, email, password } = req.body

    if (!passwordToken || !email || !password) {
      throw new CustomError.BadRequest("Please provide all values")
    }

    const user = await User.findOne({ email })

    if (user) {

      const currentDate: Date = new Date(Date.now())   
      const hashedToken: string = crypto.createHash('md5').update(passwordToken).digest('hex')

      if (user.passwordToken === hashedToken && user.passwordTokenExpirationDate > currentDate) {        
        user.password = password
        user.passwordToken = ""
        user.passwordTokenExpirationDate = null
        await user.save()
      }
    }
    
    // Regardless if email exists, we send a success msg so the attacker doesn't know if the email exists.
    res.status(StatusCodes.OK).send({ msg: 'Password has been successfully updated!' })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg: error})
  }

}

export {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
}