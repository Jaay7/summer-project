import { User } from "../../models/User";
import { Chat } from "../../models/Chat";
import { Groups } from "../../models/Groups";
import bcrypt from 'bcryptjs'
import { registerValidate, loginValidate } from "../validators/user";
import { issueToken, getAuthUser, getRefreshTokenUser } from "../../functions/auth";


export const resolvers = {
  Query: {
    users: async( root, args, { req }, info ) => {
      await getAuthUser(req);
      let users = await User.find();
      return users;
    },
    otherUser: async( root, args, { req }, info ) => {
      let result = await User.findOne({username: args.username});
      return result;
    },
    searchUser: async( root, args, { req }, info ) => {
      let search = await User.find({username: new RegExp(args.letter, "i")})
      return search;
    },
    
    profile: async( root, args, { req }, info ) => {
      let authUser = await getAuthUser(req, true);
      return authUser;
    },
    retrieveMessages: async( root, args, { req }, info ) => {
      try {
        if (!await Chat.findOne({
          $and: [
            {persons: args.currentUser},
            {persons: args.otherUser}
          ]
        })) {
          throw new Error("chat doesn't exist cannot retrieve messages")
        }
        const messages = await Chat.findOne({
          $and: [
            {persons: args.currentUser},
            {persons: args.otherUser}
          ]
        })
        // var result = Object.keys(messages.chats).map(key => messages.chats[key]).sort((a,b) => a.date > b.date ? 1 : -1)
        return messages
      } catch (error) {
        console.log(error)
      }
    },
    retrieveChats: async( root, args, { req }, info ) => {
      try {
        let allChats = await Chat.find({persons: args.currentUser})
        // let allChats = await Chat.find({$or: [
        //   {currentUser: args.currentUser},
        //   {otherUser: args.currentUser}
        // ]})
        // function getUnique(arr, index) {
        //   const unique = arr
        //     .map(e => e[index])
        //     .map((e, i, final) => final.indexOf(e) === i && i)
        //     .filter(e => arr[e]).map(e => arr[e]);
        //   return unique
        // }
        // let chats = getUnique(allChats, 'otherUser')
        return allChats
      } catch (error) {
        console.log(error)
      }
    },
    retrieveGroupMessages: async( root, args, { req }, info ) => {
      try {
        let gms = Groups.findById(args.id);
        return gms
      } catch (error) {
        console.log(error)
      }
    },
    retrieveGroups: async( root, args, { req }, info ) => {
      try {
        if (!await User.findOne({username: args.currentUser})) {
          throw new Error("users doesn't exist cannot retrieve messages")
        }
        const allGroups = Groups.find({
          $or: [
            {createdBy: args.currentUser},
            {persons: args.currentUser}
          ]
        })
        return allGroups
      } catch (error) {
        console.log(error)
      }
    },
    refreshToken: async( root, args, { req }, info ) => {
      let authUser = await getRefreshTokenUser(req, true);
      let tokens = await issueToken(authUser);
      return {
        user: authUser,
        ...tokens
      }
    },
  },
  Mutation: {
    register: async( root, args, { req }, info ) => {
      try {
        await registerValidate.validate(args, { abortEarly: false });
        let user = await User.findOne({ username: args.username });
        if (user) {
          throw new Error("Username is already taken.");
        }
        args.password = await bcrypt.hash(args.password, 10);
        let newUser = await User.create(args);
        let tokens = await issueToken(newUser);
        return {
          user: newUser,
          ...tokens,
        }
      } catch (error) {
        console.log(error)
      }
    },
    login: async( root, args, { req }, info ) => {
      await loginValidate.validate(args, {abortEarly: false});
      let user = await User.findOne({ username: args.username });
      if(!user) {
        throw new Error("Username not found!");
      }
      let isMatch = await bcrypt.compare(args.password, user.password);
      if(!isMatch) {
        throw Error("Password is incorrect!")
      }
      let tokens = await issueToken(user);
      return {
        user: user,
        ...tokens
      }
    },
    sendMessage: async(root, args, {req}, info) => {
      try {
        if (!await User.findOne({username: args.sender}) && !await User.findOne({username: args.otherUser})) {
          throw new Error("users doesn't exist cannot send message")
        }
        if (!await Chat.findOne({
          $and: [
            {persons: args.sender},
            {persons: args.otherUser}
          ]
        })) {
          let msg = await Chat.create({persons: [args.sender, args.otherUser], chats: [{
            sender: args.sender, message: args.message
          }]});
          return msg
        } else {
          let msg = [{sender: args.sender, message: args.message}]
          let chats = await Chat.findOne({
            $and: [
              {persons: args.sender},
              {persons: args.otherUser}
            ]
          })
          await Chat.updateOne(
            { $and: [
                {persons: args.sender},
                {persons: args.otherUser}
              ]
            },
            {
              $push: {
                chats: msg
              }
            }
          )
          return chats
        }
      } catch (error) {
        console.log(error)
      }

    },
    createGroup: async(root, args, {req}, info ) => {
      try {
        let groupName = args.groupName
        let currentUser = args.createdBy
        let persons = args.persons
        let out = persons.push(currentUser)
        if(groupName === '' || groupName === undefined || groupName === null) {
          groupName = ''
          groupName += persons.join(',')
        }
        let newGroup = await Groups.create({groupName: groupName, createdBy: currentUser, persons: persons});
        return newGroup
      } catch (error) {
        console.log(error)
      }
    },
    deleteGroup: async(root, args, {req}, info ) => {
      try {
        let group = await Groups.findById(args.id)
        if(group) {
          await Groups.deleteOne({_id: args.id})
          return `${group.groupName} group deleted successfully!`
        }
      } catch (error) {
        console.log(error)
      }
    },
    leaveGroup: async(root, args, {req}, info) => {
      try {
        let group = await Groups.findById(args.id)
        if (group) {
          await Groups.updateOne({_id: args.id}, {
            $pull: {
              persons: args.personName
            }
          })
          return group
        } else {
          console.log("cannot leave group")
        }
      } catch (error) {
        console.log(error)
      }
    },
    addPerson: async(root, args, {req}, info) => {
      try {
        let group = await Groups.findById(args.id)
        await Groups.updateOne(
          {_id: args.id},
          {
            $push: {
              persons: args.persons
            },
            updatedAt: Date.now
          }
        )
        return group
      } catch (error) {
        console.log(error)
      }
    },
    removePerson: async(root, args, {req}, info) => {
      try {
        let group = await Groups.findById(args.id)
          if (group.createdBy === args.admin) {
          await Groups.updateOne(
            {_id: args.id},
            {
              $pull: {
                persons: args.person
              },
              updatedAt: Date.now
            }
          )
          return group
        } else {
          console.log('you cannot remove person - you are not the admin')
        }
      } catch (error) {
        console.log(error)
      }
    },
    sendGroupMessage: async(root, args, {req}, info) => {
      try {
        let chat = [{sender: args.sender, message: args.message}]
        let group = await Groups.findById(args.id)
        await Groups.updateOne(
          {_id: args.id},
          {
            $push: {
              chats: chat
            }
          }
        )
        return group
      } catch (error) {
        console.log(error)
      }
    },
    editGroupName: async(root, args, {req}, info) => {
      try {
        let group = await Groups.findById(args.id);
        await Groups.updateOne(
          {_id: args.id},
          {
            $set: {
              groupName: args.groupName
            }
          }
        )
        return group
      } catch (error) {
        console.log(error)
      }
    },
    editName: async(root, args, {req}, info) => {
      try {
        let user = await User.findOne({username: args.username})
        if (user) {
          await User.updateOne(
            {username: args.username},
            {
              $set: {
                name: args.newName
              }
            }
          )
        } else {
          throw new Error("user not found.")
        }
      } catch(err) {
        console.log(err)
      }
    },
    editEmail: async(root, args, {req}, info) => {
      try {
        let user = await User.findOne({username: args.username})
        if (user) {
          await User.updateOne(
            {username: args.username},
            {
              $set: {
                email: args.newEmail
              }
            }
          )
        } else {
          throw new Error("user not found.")
        }
      } catch(err) {
        console.log(err)
      }
    },
    setSeen: async(root, args, {req}, info) => {
      try {
        if (!await User.findOne({username: args.currentUser}) && !await User.findOne({username: args.otherUser})) {
          throw new Error("users doesn't exist")
        }
        await Chat.updateMany({
          $and: [
            {currentUser: args.otherUser},
            {otherUser: args.currentUser}
          ]
        }, 
        {
          $set: {
            isSeen: args.isSeen
          }
        }, { multi: true}
        );
        return {message: `${args.currentUser} saw the messages`}
      } catch (error) {
        console.log(error)
      }
    },
    removeFromGroup: async(root, args, {req}, info) => {
      try {
        let group = Groups.findById(args.id)
        if(!group) {
          throw new Error("Group doesn't exist")
        }
        await Groups.updateOne(
          {_id: args.id},
          {
            $pull: {
              persons: args.persons
            }
          }
        )
        return group
      } catch (error) {
        console.log(error)
      }
    }
  }
}


