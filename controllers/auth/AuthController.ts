import express, { Express, Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import userModel from "../../models/userModel";
import * as jwt from "jsonwebtoken";
import { log } from "console";
import { BadRequestError, UnAuthorized } from "../../errors";
import crypto from "crypto";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import httpStatus, { BAD_REQUEST } from "http-status";
interface Userbody{
    username: string;
    password: string;
    email: string;
}
async function Signup(req: Request, res: Response, next: NextFunction) {
  console.log('auth controller hit successfully')
    const { username, email, password } : Userbody = req.body;
    const hashpassword = bcryptjs.hashSync(password, 10);
    
      
    const EmailAlreadyExist = await userModel.findOne({ email });

    if(EmailAlreadyExist){
    return  res.status(BAD_REQUEST).json({ message: "Email already exist" })
        // throw new BadRequestError('Email already exist')
    }
    //  const isfirstAccount = (await userModel.countDocuments({})) === 0; 

    //  const role = isfirstAccount ? "admin" : "user";


     const verificationToken =  crypto.randomBytes(40).toString('hex')
     try {
 

    const newUser = await userModel.create({
      username,
      email,
      password: hashpassword,
      verificationToken,
    });


    const origin = 'http://localhost:3000';
  
    await sendVerificationEmail({
      name:newUser?.username,
      email:newUser?.email,
      verificationToken: newUser?.verificationToken,
      origin,
    })

    res.status(httpStatus.CREATED).json({
      message: "Success! Please check your mail to verify your account"
    })

      log(newUser, "newUser");
    } catch (error: Error | any) {

   console.log(error)
     next(error)
   
    }
    
}


async function verifyEmail(req:Request, res:Response)  {

  try {
    
    const {verificationToken, } : {verificationToken: string, } = req.body;
      const user =  await  userModel.findOne({ verificationToken })
      if(!user){
       throw new UnAuthorized('verification failed')
      }
    
        if(user.verificationToken !== verificationToken  ){
          throw new UnAuthorized('verification failed')
        }

          
              user.isVerified = true;
              user.verified = new Date();
              user.verificationToken = ""; 
              await user.save();
          
              res.status(httpStatus.CREATED).json({ message: "Email verified", isverified:user.isVerified, email:user.email });

        
  } catch (error: Error | any)  {
   res.status(httpStatus.BAD_REQUEST).json({message: error.message})
  }
}
async function Signin(req: Request, res: Response, next:NextFunction) {
  const { email, password } = req.body;

 if(!email || !password){
      throw new BadRequestError('Please provide email and password')
     }
     
     try {
      let mainMail = await  userModel.findOne({email})

      if(!mainMail){
       return res.status(400).json({ message: "user not found" });
      }

     } catch (error) {
       next(error)
     }


}

export { Signup, Signin ,verifyEmail};
