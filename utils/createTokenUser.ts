
import { Document } from "mongoose"

interface Users extends Document{
    username: string;
    _id: string;
    email: string;
}

export default function createTokenUser(user:Users) {
  return {
    username: user.username,
    _id: user._id,
    email: user.email,
  }
}
