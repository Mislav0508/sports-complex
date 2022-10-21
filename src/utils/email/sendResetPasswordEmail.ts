import CustomError from "../../errors"

const sgMail = require('@sendgrid/mail')

const sendResetPasswordEmail = async (passwordToken: string, email: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'mcdesign0508@gmail.com', // Change to your recipient
    from: 'mcdesign0508@gmail.com', // Change to your verified sender
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
    .catch((error: any) => {
      console.log(error)      
      throw new CustomError.BadRequest("Something went wrong.")
    })
}

export { sendResetPasswordEmail }