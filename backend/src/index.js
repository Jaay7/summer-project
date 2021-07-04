import { ApolloServer } from "apollo-server-express";
import express from"express"
import mongoose from "mongoose"
import bodyParser from "body-parser";
import { resolvers } from "./graphql/resolvers/resolvers";
import { typeDefs } from "./graphql/typeDefs/typeDefs";
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI

const startServer = async() => {
  const app = express();

  app.disable("x-powered-by");
  
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => ({req, res}),
  });
  
  server.applyMiddleware({ app });

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('connected to mongodb'))
    .catch((err) => console.log(`error in connection: ${err}`));

  

  app.listen({ port: 4000 }, () => {
    console.log(`🎉🏃🏻‍♂️Server ready at http://localhost:4000${server.graphqlPath}`)
  });

}

startServer();