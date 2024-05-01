import mongoose, { Document, Model } from "mongoose";
// import bycrpt from "bcryptjs";
import bcrypt from "bcrypt";
import validator from "validator";

/**
 * UserDocument interface extends mongoose's Document interface and defines the structure of a user document.
 * @interface
 */
interface UserDocument extends Document {
  /**
   * User's username.
   * @type {string}
   * @memberof UserDocument
   * @required
   */
  username: string;

  /**
   * User's email.
   * @type {string}
   * @memberof UserDocument
   * @required
   * @validator A regular expression is used to validate the email format.
   */
  email: string;

  /**
   * User's password.
   * @type {string}
   * @memberof UserDocument
   * @required
   */
  password: string;

  /**
   * User's verification token.
   * @type {string}
   * @memberof UserDocument
   */
  verificationToken: string;

  /**
   * Indicates whether the user's email is verified.
   * @type {boolean}
   * @memberof UserDocument
   * @default false
   */
  isVerified: boolean;

  /**
   * Date when the user's email was verified.
   * @type {Date}
   * @memberof UserDocument
   */
  verified: Date;

  /**
   * User's password token for password reset.
   * @type {string}
   * @memberof UserDocument
   */
  passwordToken?: string;

  /**
   * Date when the password reset token expires.
   * @type {Date}
   * @memberof UserDocument
   */
  passwordTokenExpiration: Date | string;

  /**
   * Compares the provided password with the stored password hash.
   * @param {string} userPassword - The password to compare with the stored hash.
   * @returns {Promise<boolean>} - A boolean value indicating whether the provided password matches the stored hash.
   * @memberof UserDocument
   */
  comparePassword(userPassword: string): Promise<boolean>;
}

/**
 * UserModel interface extends mongoose's Model interface and defines the methods available for the UserDocument model.
 * @interface
 */
interface UserModel extends Model<UserDocument> {
  // You can add static methods here if needed
}

/**
 * Validates the user's email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} - A boolean value indicating whether the email format is valid.
 */
const emailValidator = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Defines the schema for a user document.
 * @type {mongoose.Schema<UserDocument, UserModel>}
 */
const UserSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: [true, "please provide email"],
      validate: {
        validator: emailValidator,
        message: "please provide valid email",
      },
    },
    password: {
      type: String,
      require: [true, "please provide a password"],
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save middleware that hashes the user's password before saving the document.
 * @param {mongoose.HookNextFunction} next - A callback function to call when the middleware is done.
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If password is not modified, proceed to the next middleware
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Compares the provided password with the stored password hash.
 * @param {string} userPassword - The password to compare with the stored hash.
 * @returns {Promise<boolean>} - A boolean value indicating whether the provided password matches the stored hash.
 */
UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

/**
 * Exports the UserDocument model.
 * @type {mongoose.Model<UserDocument, UserModel>}
 */
export default mongoose.model<UserDocument, UserModel>("usermodel", UserSchema);