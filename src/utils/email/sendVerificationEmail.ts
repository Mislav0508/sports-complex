import CustomError from "../../errors"

const sgMail = require('@sendgrid/mail')
const sendVerificationEmail = async (verificationToken: string, email: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'mcdesign0508@gmail.com', // Change to your recipient
    from: 'mcdesign0508@gmail.com', // Change to your verified sender
    subject: 'Verify Email',
    text: 'Click the link below to verify your account.',
    html: `<a href="http://localhost:3000/user/verify-email?verificationToken=${verificationToken}&email=${email}">Verify email</a>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error: any) => {
      console.log(error)      
      throw new CustomError.BadRequest("Something went wrong.")
    })
}

export { sendVerificationEmail }