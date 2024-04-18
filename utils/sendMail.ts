import nodemailer from "nodemailer";
import  nodemailerConfig from "./nodemailerConfig";

interface SendMails{
    to: string ,
    subject: string ,
    html: string ,
} 
 export async function SendMail({to, subject, html}: SendMails) {
  let testAccount = await nodemailer.createTestAccount()
  
  const transporter = nodemailer.createTransport(nodemailerConfig)
  return transporter.sendMail({
    from: '"efficsync" <efficsync@gmail.com>',
    to,
    subject,
    html,
  })
}