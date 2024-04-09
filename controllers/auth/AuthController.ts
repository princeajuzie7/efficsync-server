import express, { Express, Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import Usermodel from "../../models/userModel";
import * as jwt from "jsonwebtoken";
import { log } from "console";

interface Userbody{
    username: string;
    password: string;
    email: string;
}
async function Signup(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const hashpassword = bcryptjs.hashSync(password, 10);
  
    const checkusername = await Usermodel.findOne({ username });
  
    if (checkusername) {
      return res.status(400).json({ message: "username already exist" });
    }
  
    const newUser = new Usermodel({
      username,
      email,
      password: hashpassword,
    });
  
    try {
      await newUser.save();
  
      res.status(201).json({ newUser, message: "user created successfully" });
      log(newUser, "newUser");
    } catch (error: Error | any) {
   console.log(error)

   
    }
}

async function Signin(req: Request, res: Response) {}

export { Signup, Signin };
