import nodemailer from "nodemailer";
import  nodemailerConfig from "./nodemailerConfig";

interface SendMails{
    to: string | null | undefined,
    subject: string| null | undefined,
    html: string | null | undefined,
} 
 export async function SendMail({to, subject, html}: SendMails) {
  let testAccount = await nodemailer.createTestAccount()
  
  const transporter = nodemailer.createTransporter(nodemailerConfig)
  return transporter.SendMail({
    from: '"efficsync" <efficsync@gmail.com>',
    to,
    subject,
    html,
  })
}