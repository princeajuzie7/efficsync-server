import express, { Express, Request, Response,NextFunction } from "express";
import AuthRouter from "../routes/auth/AuthRoutes";
import Dbconnection from "../database/dbConnection";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel";
import sendVerificationEmail from "../utils/sendVerificationEmail";
import UserRouter from "../routes/user/UserRoutes";
config()

/**
 * Initializes the Express application.
 * @param none
 * @returns Express application instance.
 */
const app: Express = express();

/**
 * Sets the origins allowed to send requests to the Express application.
 * @param none
 * @returns none
 */
const origin =  "http://localhost:3000";

/**
 * Configures CORS settings for the Express application.
 * @param none
 * @returns none
 */
app.use(cors({ origin: origin, credentials: true, methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"] }));

/**
 * Parses JSON data for the Express application.
 * @param none
 * @returns none
 */
app.use(express.json());

/*
 * Parses cookies for the Express application.
 * @param none
 * @returns none
 */
app.use(cookieParser(process.env.JWT_SECRET_KEY));


passport.serializeUser((user: any, done) => {
    done(null, user);
})

passport.deserializeUser( async(id: any, done) => {
  try {
      const user = await userModel.findById(id)
      done(user, null)
  } catch (error:Error |any) {
    done(null, error)
  }
})
const SessionSeceret = process.env.SESSION_SECERET;
if (!SessionSeceret) {
    throw new Error(
      "Session secret is not defined in environment variables."
    );
  
}


app.use(
  session({
    secret: SessionSeceret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

const clientID = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH__CLIENT_SECERET;

if (!clientID || !clientSecret) {
  throw new Error(
    "Google OAuth client ID and secret are not defined in environment variables."
  );
}


passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
      async function (accessToken: string, refreshToken: string, profile: any, done) {
          try {
              
              let user = await userModel.findOne({
                email: profile.email[0].value,
              })
              
              if (!user) {
                  user = await userModel.create({
                      email: profile.email[0].value,
                      name: profile.name.displayName,
                      picture: profile.photos[0].value,
                      googleId: profile.id,
                  })

                      await sendVerificationEmail({
                        name: user?.username,
                        email: user?.email,
                        verificationToken: user?.verificationToken,
                        origin,
                      });
    
              }
              return done(null, user);
          } catch (error:Error |any) {
              return done(null, error);
          }
    }
  )
);


app.use(passport.initialize());

app.use(passport.session());

/**

/**
 * Mounts the AuthRouter to the specified path.
 * @param none
 * @returns none
 */
app.use("/client/api/auth", AuthRouter);



app.use("/client/api/user", UserRouter);
/**
 * Connects the Express application to the database.
 * @param app Express application instance.
 * @returns none
 */
Dbconnection(app);


/**
 * Exports the Express application instance.
 * @param none
 * @returns Express application instance.
 */
export default app;