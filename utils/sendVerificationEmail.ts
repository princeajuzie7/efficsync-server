import { SendMail } from "./sendMail";

export default function sendVerificationEmail({name, email, verificationToken, origin}: {name: string, email: string, verificationToken:string,  origin: string;}) {
    
    const verifyEmail = `${origin}/auth/verifyemail?token=${verificationToken}&email=${email}`;

    const message= `<p>Please confirm your email by clicking on the following link :
    <a href="${verifyEmail}"> Verify Email </a></p>`;

    return SendMail({
        to:email,
        subject: "Email verification",
        html: `<h4> Hello, ${name}</h4> ${message} `

    })
}