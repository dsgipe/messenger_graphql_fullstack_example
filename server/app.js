const {ApolloServer, gql, PubSub} = require('apollo-server')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';
const client = new MongoClient(url);

const pubsub = new PubSub();

const typeDefs = gql`
    type Message {
        id: ID
        name: String
        message: String
    }

    type ToDo {
        id: ID
        type: String
    }

    type Query {
        users(id:String): [Message]
    }

    type Mutation {
        sendMessage(type:String, id:String): String
    }

    type Subscription {
        commentAdded(postID: ID!): ToDo
    }
`
const tableName = "messages"

client.connect().then(client => client.db(dbName).collection(tableName)
    // .drop())
    .createIndex({"createdAt": 1}, {expireAfterSeconds: 60 * 60}))

const resolvers = {
    Mutation: {
        sendMessage: (obj, {type, id}, context) => {

            client.connect(function (err) {

                client.db(dbName).collection(tableName).insertOne({
                    id: id,
                    message: type,
                    createdAt: new Date(),
                })
            });

            pubsub.publish('COMMENT_ADDED', {
                commentAdded: {
                    id: id,
                    type: type,
                }
            });

        },
    },

    Subscription: {
        commentAdded: {
            subscribe: () => {
                return pubsub.asyncIterator(['COMMENT_ADDED'])
            }
        }
    },
    Query: {
        users: async (obj, {id}, context) =>
            await client.connect().then(client =>
                client.db(dbName).collection(tableName)
                    .find(id ? {id: {$eq: id}} : {})
                    .limit(100)
                    .map(it => ({id: it._id, message: it.message, name:it.id})).toArray())

    },
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        path: '/subscriptions',
        onConnect: (connectionParams, webSocket, context) => {
            console.log('Client connected');
        },
        onDisconnect: (webSocket, context) => {
            console.log('Client disconnected')
        },
    },
})

server.listen().then(({url}) => console.log(`Server ready at ${url}`))
