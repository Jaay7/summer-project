import { Schema, model, Types } from 'mongoose';

const GroupsSchema = new Schema({
  groupName: {
    type: String,
    default: Types.ObjectId
  },
  createdBy: {
    type: String
  },
  persons: [String],
  chats: [{
    sender: String,
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  }, {_id: false}]
}, {timestamps: true})

export const Groups = model('Groups', GroupsSchema );
