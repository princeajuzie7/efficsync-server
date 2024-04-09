import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
},{timestamps: true});


const Usermodel = mongoose.model('usermodel', UserSchema);

export default Usermodel;
