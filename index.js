const {ApolloServer} = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

const typeDefs = require('fs').readFileSync('./schema.graphql', 'utf8')
const resolvers = require('./resolvers');

const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
})
server.applyMiddleware({ app })

app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))
app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`);
})
