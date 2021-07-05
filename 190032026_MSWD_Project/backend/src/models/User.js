import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  { 
    profilePic: {
      type: String,
      required: false,
      default: 'https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png',
      unique: false
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

export const User = model('User', UserSchema );
