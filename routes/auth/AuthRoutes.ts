import express, { Express } from "express";
import { Signup, Signin , verifyEmail} from "../../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.route('/signup').post(Signup)

AuthRouter.route('/signin').post(Signin)
AuthRouter.route('/verifyemail').post(verifyEmail)





export default AuthRouter;
