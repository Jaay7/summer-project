import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    profile: User
    users: [User!]!
    refreshToken: Auth!
    otherUser(username: String!): User
    searchUser(letter: String!): [User!]!
    retrieveMessages(currentUser: String!, otherUser: String!): [Chat!]!
    retrieveChats(currentUser: String!): [Chat!]!
    retrieveGroupMessages(id: ID!): GroupChat!
    retrieveGroups(currentUser: String!): [GroupChat!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }
  type Auth {
    user: User
    token: String!
    refreshToken: String!
  }
  type Chat {
    currentUser: String!
    otherUser: String!
    message: String!
    isSeen: Boolean
    createdAt: String!
  }
  
  type chats {
    sender: String!
    message: String!
    date: String
  }
  type GroupChat {
    id: ID!
    groupName: String
    createdBy: String!
    persons: [String!]!
    chats: [chats]!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    register(
      name: String!
      email: String!
      username: String!
      password: String!
    ): Auth!
    login(username: String!, password: String!): Auth!
    sendMessage(
      currentUser: String!
      otherUser: String!
      message: String!
    ): Chat!
    createGroup(
      groupName: String
      createdBy: String!
      persons: [String!]!
    ): GroupChat!
    addPerson(
      id: ID!
      currentUser: String!
      persons: [String!]!
    ): GroupChat!
    sendGroupMessage(
      id: ID!
      sender: String!
      message: String!
    ): GroupChat!
    editGroupName(
      id: ID!
      groupName: String!
    ): GroupChat!
    editName(
      username: String!
      newName: String!
    ): User
    editEmail(
      username: String!
      newEmail: String!
    ): User
    setSeen(
      currentUser: String!
      otherUser: String!
      isSeen: Boolean!
    ): String
    removeFromGroup(
      id: ID!
      admin: String!
      persons: [String!]!
    ): GroupChat!
  }
`;

// input GroupUsers {
  //   username: String!
  // }