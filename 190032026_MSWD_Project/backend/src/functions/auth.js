import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AuthenticationError } from 'apollo-server-express'
require('dotenv').config();

const APP_SECRET = process.env.APP_SECRET
const APP_REFRESH_SECRET = process.env.APP_REFRESH_SECRET

export const issueToken = async({ username, email, name, id }) => {
  let token = await jwt.sign({ username, email, name, id }, APP_SECRET );
  let refreshToken = await jwt.sign({ username, email, name, id }, APP_REFRESH_SECRET, {
    expiresIn: "2d"
  });
  return {
    token,
    refreshToken
  }
}

export const getAuthUser = async(req, requiresAuth = false) => {
  const header = req.headers['authorization'];
  if (header) {
    const token = jwt.verify(header, APP_SECRET);
    console.log("TOKEN_DECODED", token);
    let authUser = await User.findById(token.id);
    if(!authUser) {
      throw new AuthenticationError("Invalid token, User authentication failed");
    }
    if (requiresAuth) {
      return authUser;
    }
    return null;
  }
}

export const getRefreshTokenUser = async (req) => {
  const header = req.headers['refresh_token'];
  if (header) {
    const token = jwt.verify(header, APP_REFRESH_SECRET);
    console.log("TOKEN_DECODED", token);
    let authUser = await User.findById(token.id);
    if(!authUser) {
      throw new AuthenticationError("Invalid refresh token, User authentication failed");
    }
    return authUser;
  }
}