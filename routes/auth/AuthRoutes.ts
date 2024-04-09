import express, { Express } from "express";
import { Signup, Signin } from "../../controllers/auth";
const AuthRouter = express.Router();

AuthRouter.route('/signup').post(Signup)

AuthRouter.route('/signin').post(Signin)





export default AuthRouter;
