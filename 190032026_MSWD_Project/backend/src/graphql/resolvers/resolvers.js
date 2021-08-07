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
        if (!await User.findOne({username: args.currentUser}) && !await User.findOne({username: args.otherUser})) {
          throw new Error("users doesn't exist cannot retrieve messages")
        }
        const messages = await Chat.find({
          $or: [
            {$and: [
              {currentUser: args.currentUser},
              {otherUser: args.otherUser}
            ]},
            {$and: [
              {currentUser: args.otherUser},
              {otherUser: args.currentUser}
            ]}
          ]
        });
        var result = Object.keys(messages).map(key => messages[key]).sort((a,b) => a.createdAt > b.createdAt ? 1 : -1)
        return result
      } catch (error) {
        console.log(error)
      }
    },
    retrieveChats: async( root, args, { req }, info ) => {
      try {
        let allChats = await Chat.find({currentUser: args.currentUser})
        // let allChats = await Chat.find({$or: [
        //   {currentUser: args.currentUser},
        //   {otherUser: args.currentUser}
        // ]})
        function getUnique(arr, index) {
          const unique = arr
            .map(e => e[index])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);
          return unique
        }
        let chats = getUnique(allChats, 'otherUser')
        return chats
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
        if (!await User.findOne({username: args.currentUser}) && !await User.findOne({username: args.otherUser})) {
          throw new Error("users doesn't exist cannot send message")
        }
        let msg = await Chat.create(args);
        return msg
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


