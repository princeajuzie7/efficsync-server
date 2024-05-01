import { SendMail } from "./sendMail";


export default function sendPasswordResetToken({username, email, origin, passwordResetToken}: {username: string, email: string, origin: string, passwordResetToken: string}){
    const resetlink = `${origin}/auth/verifypasswordresetoken/?token=${passwordResetToken}`;
    const message = `<p> Hey ${username} please click on this link to reset your email <a href="${resetlink}"> reset password</a></p>`

    return SendMail({
        to: email,
        subject: "password reset",
        html: message,
    })
}