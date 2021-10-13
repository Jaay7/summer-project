import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  persons: [String],
  chats: [{
    sender: String,
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  }, {_id: false}],
}, {timestamps: true})

export const Chat = model('Chat', ChatSchema);