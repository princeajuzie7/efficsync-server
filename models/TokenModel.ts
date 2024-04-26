import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            required: true,
            readOnly: true,
            unique: true 
        },
        ip:{
            type: String,
            required: true,
            readOnly: true,
            unique: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "usermodel",
            required: true,
            readOnly: true,
            unique: true
        }


    }
)

export default  mongoose.model("Tokenmodel", TokenSchema)