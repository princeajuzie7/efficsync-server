import mongoose, { Document, Model } from "mongoose";
// import bycrpt from "bcryptjs";
import bcrypt from "bcrypt";
import validator from "validator";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken?: string;
  passwordTokenExpiration?: Date;
  comparePassword(userpassword: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  // You can add static methods here if needed
}

const emailValidator = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const UserSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: [true, "pleade provide email"],
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

// UserSchema.pre('save', async function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt();
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error:any) {
//     return next(error);
//   }
// });


UserSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};


export default mongoose.model<UserDocument, UserModel>("usermodel", UserSchema);
