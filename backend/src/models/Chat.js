import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  currentUser: {
    type: String,
    required: true,
    unique: false,
  },
  otherUser: {
    type: String,
    required: true,
    unique: false,
  },
  message: {
    type: String,
    required: true,
    unique: false,
  },
  isSeen: {
    type: Boolean,
    default: false,
    unique: false
  }
}, {timestamps: true})

export const Chat = model('Chat', ChatSchema);