import CustomError from "../../errors"

const sgMail = require('@sendgrid/mail')
const sendVerificationEmail = async (verificationToken: string, email: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: process.env.RECIPIENT_EMAIL, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject: 'Verify Email',
    text: 'Click the link below to verify your account.',
    html: `<a href="http://localhost:3000/user/verify-email?verificationToken=${verificationToken}&email=${email}">Verify email</a>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error: object) => {
      console.error(error)      
      throw new CustomError.BadRequest("Something went wrong.")
    })
}

export { sendVerificationEmail }