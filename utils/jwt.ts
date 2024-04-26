import  Jwt  from "jsonwebtoken";
require('dotenv').config()
import { Response } from "express";
const secretKey = process.env.JWT_SECRET_KEY;
export const createJWT = ({payload}: {payload:any})=>{
    if (!secretKey) {
        throw new Error("JWT secret key is not defined in environment variables");
    }
    const token = Jwt.sign(payload,secretKey)
    return token;
}

export const isTokenValid = (token: string) => {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined in environment variables");
    }
    try {
        Jwt.verify(token, secretKey);
        return true; // Token is valid
        
    } catch (error) {
        return false; // Token is invalid
    }
}

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

