require('dotenv').config()

export default{
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASSWORD,
    }
}



