import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken?: string;
  passwordTokenExpiration?: Date;
}

interface UserModel extends Model<UserDocument> {}

const emailValidator = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const UserSchema = new Schema<UserDocument, UserModel>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: emailValidator,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: String,
  passwordTokenExpiration: Date,
}, { timestamps: true });

UserSchema.pre<UserDocument>("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userpassword: string) {
  const isMatch = await bcrypt.compare(userpassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model<UserDocument, UserModel>("UserModel", UserSchema);

async function verifyEmail(req: Request, res: Response) {
  const { verificationToken, email }: { verificationToken: string, email: string } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Verification failed");
  }

  if (user.isVerified || user.verificationToken !== verificationToken) {
    throw new Error("Verification failed");
  }

  // Set user as verified and save the changes
  user.isVerified = true;
  user.verified = new Date();
  await user.save();

  res.send("Email verified successfully!");
}
