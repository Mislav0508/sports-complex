import CustomError from "../../errors"

const sgMail = require('@sendgrid/mail')

const sendResetPasswordEmail = async (passwordToken: string, email: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: process.env.RECIPIENT_EMAIL, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject: 'Reset Password',
    text: 'Click the link below to reset your password.',
    html: `<p>Please reset password by clicking on the following link : 
    <a href="http://localhost:3000/user/reset-password?passwordToken=${passwordToken}&email=${email}">Reset Password</a></p>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Reset Password email sent')
    })
    .catch((error: object) => {
      console.error(error)      
      throw new CustomError.BadRequest("Something went wrong.")
    })
}

export { sendResetPasswordEmail }