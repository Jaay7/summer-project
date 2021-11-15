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

  

  app.listen(process.env.PORT || 5000 , () => {
    console.log(`🎉🏃🏻‍♂️Server ready at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`)
  });

}

startServer();