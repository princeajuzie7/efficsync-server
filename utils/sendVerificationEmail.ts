import { SendMail } from "./sendMail";

export default function sendVerificationEmail({name, email, verificationToken, origin}: {name: string | null | undefined, email: string| null | undefined, verificationToken:string| null | undefined,  origin: string| null | undefined;}) {
    
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

    const message= `<p>Please confirm your email by clicking on the following link :
    <a href="${verifyEmail}"> Verify Email </a></p>`;

    return SendMail({
        to:email,
        subject: "Email verification",
        html: `<h4> Hello, ${name}</h4> ${message} `

    })
}