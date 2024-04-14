import mongoose, { Document, Model } from "mongoose";
import bycrpt from "bcryptjs";
import validator from "validator"

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

interface UserModel extends Model<UserDocument> {
  // You can add static methods here if needed
}

const emailValidator = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
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
  isVerified:{
    type: Boolean,
    default: false,
  },
   
  verified:Date,
  passwordToken:{
    type: String,
  },
  passwordTokenExpiration: {
    type:Date,
  }

},{timestamps: true});


UserSchema.pre("save", async function () {
  
  if(!this.isModified('password') || !this.password ) return
  const salt = await bycrpt.genSalt(10)
  this.password = await bycrpt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (userpassword: string) {
  const isMatch = await bycrpt.compare(userpassword, this.password)
  return isMatch;
}
export default  mongoose.model<UserDocument, UserModel>('usermodel', UserSchema);


