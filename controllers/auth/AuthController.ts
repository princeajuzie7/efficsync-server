import express, { Express, Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import userModel from "../../models/userModel";
import * as jwt from "jsonwebtoken";
import { log } from "console";
import { BadRequestError, UnAuthorized } from "../../errors";
import crypto from "crypto";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import httpStatus, { BAD_REQUEST, OK } from "http-status";
import createTokenUser from "../../utils/createTokenUser";
import TokenModel from "../../models/TokenModel";
import { attachCookiesToResponse } from "../../utils/jwt";
interface Userbody {
  username: string;
  password: string;
  email: string;
}
async function Signup(req: Request, res: Response, next: NextFunction) {
  console.log("auth controller hit successfully");
  const { username, email, password }: Userbody = req.body;
 
  const EmailAlreadyExist = await userModel.findOne({ email });

  if (EmailAlreadyExist) {
    return res.status(BAD_REQUEST).json({ message: "Email already exist" });
    // throw new BadRequestError('Email already exist')
  }
  //  const isfirstAccount = (await userModel.countDocuments({})) === 0;

  //  const role = isfirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");
  try {
    const newUser = await userModel.create({
      username,
      email,
      password,
      verificationToken,
    });

    const origin = "http://localhost:3000";

    await sendVerificationEmail({
      name: newUser?.username,
      email: newUser?.email,
      verificationToken: newUser?.verificationToken,
      origin,
    });

    res.status(httpStatus.CREATED).json({
      message: "Success! Please check your mail to verify your account",
    });

    log(newUser, "newUser");
  } catch (error: Error | any) {
    console.log(error);
    next(error);
  }
}

/**
 * Verifies an email address by comparing the provided verification token with the stored token for the given email address.
 * If the tokens match, the user's email address is marked as verified and the function returns a response indicating success.
 * If the tokens do not match, or if the email address is not found, the function returns an error response.
 * @param req - Express request object
 * @param res - Express response object
 */

async function verifyEmail(req: Request, res: Response) {
  try {
    const {
      verificationToken,
      email,
    }: { verificationToken: string; email: string } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new UnAuthorized("verification failed");
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnAuthorized("verification failed");
    }

    user.isVerified = true;
    user.verified = new Date();
    user.verificationToken = "";
    await user.save();

    res.status(httpStatus.CREATED).json({
      message: "Email verified",
      isverified: user.isVerified,
      email: user.email,
    });
  } catch (error: Error | any) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
}
async function Signin(req: Request, res: Response, next: NextFunction) {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("incorrect email ");
      throw new UnAuthorized("invalid credentials");
    }

    const ispasswordCorrect = await user.comparePassword(password);
    console.log(ispasswordCorrect, "ispasswordCorrect");
    if (!ispasswordCorrect) {
      console.log("password incorrect");
      throw new UnAuthorized("invalid credentials");
    }

    if (!user.isVerified) {
      throw new UnAuthorized("Please verify your email first");
    }

    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await TokenModel.findOne({ user: user._id });

    if (existingToken) {
      const { $isValid } = existingToken;
      console.log("token existing");

      if (!$isValid) {
        throw new UnAuthorized("invalid credentials");
      }
      refreshToken = existingToken.refreshToken;
      
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res.status(OK).json({ user: tokenUser });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    await TokenModel.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(OK).json({ user: tokenUser, message: "logged in successfully" });
  } catch (error) {
    next(error);
  }
}

export { Signup, Signin, verifyEmail };
