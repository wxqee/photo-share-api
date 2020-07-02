const utils = require('../utils')

const Mutation = {
    async addFakeUsers(parent, { count }, { db }) {
        const randomUsers = await utils.requestRandomUsers(count)
        console.log(randomUsers);
        const users = randomUsers.results
            .map(r => ({
                githubLogin: r.login.username,
                name: `${r.name.first} ${r.name.last}`,
                avatar: r.picture.thumbnail,
                githubToken: r.login.sha1,
            }))
        const { ops } = await db.collection('users').insertMany(users)
        return ops
    },
    async postPhoto(parent, args, { db, user }) {
        if (!user) {
            throw new Error('only a authorized user can post a photo')
        }

        const newPhoto = {
            ...args.input,
            userID: user.githubLogin,
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
