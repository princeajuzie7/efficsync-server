import  Jwt  from "jsonwebtoken";
require('dotenv').config()
import { Response } from "express";
const secretKey = process.env.JWT_SECRET_KEY;


interface Payload {
  user: any; // Define the type for user
  refreshToken?: string; // Make refreshToken optional
}

export const createJWT = ({ payload }: { payload: any }) => {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined in environment variables");
    }
    const token = Jwt.sign(payload,secretKey)
    return token;
}

export const isTokenValid = (token: string): Payload => {
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }
  try {
    const payload: Payload = Jwt.verify(token, secretKey) as Payload;
    return payload; // Return payload if token is valid
  } catch (error) {
    throw new Error("Invalid token"); // Throw error if token is invalid
  }
};



export const attachCookiesToResponse = ({res, user, refreshToken}: {res: Response, user:any, refreshToken:string})=>{
    const acccessTokenJWT = createJWT({payload: {user}})
    const refreshTokenJWT = createJWT({payload: {user, refreshToken}})
    
    const oneDay = 1000 * 60 *60 *24;
    const longerEXP = 1000 *60 *60 *24 *30;

    res.cookie('accessToken', acccessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + longerEXP)
    })

}

