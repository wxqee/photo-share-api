require('dotenv').config()
const {ApolloServer} = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

const typeDefs = require('fs').readFileSync('./schema.graphql', 'utf8')
const resolvers = require('./resolvers')
const { fakeDb } = require('./resolvers/fixtures')

const mongo = require('./mongo')

const start = async () => {
    const { db } = await mongo.connect()

    if (process.env.NODE_ENV !== 'production') {
        console.log('Preparing fake data...');
        await fakeDb(db);
    }

    const app = express()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const githubToken = req.headers.authorization;
            const user = await db
                .collection('users')
                .findOne({ githubToken })
            return {
                db,
                user,
            }
        },
    })
    server.applyMiddleware({ app })

    app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

    app.listen({ port: 4000 }, () => {
        console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`);
    })
}

start()
