const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Db is now connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`The graphQl Server is runnning at ${res.url}`);
  });
