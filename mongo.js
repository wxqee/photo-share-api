const { MongoClient } = require('mongodb');

const url = process.env.DB_HOST
const dbName = process.env.DB_NAME
const client = new MongoClient(url, { useUnifiedTopology: true });

module.exports = {
    async connect() {
        await client.connect().then(client => {
            console.log('MongoDB Client is created.');
            return client;
        }).catch(err => {
            console.error('MongoDB Client failed.', err);
            return err;
        });

        const db = client.db(dbName);

        return { db, client }
    },
    close() {
        client.close()
    }
}
