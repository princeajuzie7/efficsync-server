import express, { Express } from "express";
import {
  Signup,
  Signin,
  verifyEmail,
  forgotPassword,
  updatePassword,
  verifyPasswordResetToken,
} from "../../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.route('/signup').post(Signup)

AuthRouter.route('/signin').post(Signin)
AuthRouter.route('/verifyemail').post(verifyEmail)

AuthRouter.route("/forgotpassword").post(forgotPassword);

AuthRouter.route('/updatepassword').post(updatePassword);
AuthRouter.route("/verifypasswordresetoken/:token").get(
  verifyPasswordResetToken
);





export default AuthRouter;
