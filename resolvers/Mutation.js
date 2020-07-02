const utils = require('../utils')

const Mutation = {
    async postPhoto(parent, args, { db }) {
        const newPhoto = {
            ...args.input,
            created: new Date(),
        }

        const result = await db
            .collection('photos')
            .insertOne(newPhoto)

        return {
            id: result.insertedId,
            ...newPhoto,
        }
    },
    async githubAuth(parent, { code }, { db }) {
        let {
            message,
            access_token,
            avatar_url,
            login,
            name
        } = await utils.authorizeWithGithub({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        })

        if (message) {
            throw new Error(message)
        }

        let latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url,
        }

        const {
            ops: [user]
        } = await db
            .collection('users')
            .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })

        return {
            user,
            token: access_token,
        }
    }
};

module.exports = Mutation;
