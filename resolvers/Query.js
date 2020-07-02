const { photos } = require('./fixtures');

const Query = {
    totalPhotos: async (parent, args, { db }) =>
        await db
            .collection('photos')
            .countDocuments(),
    allPhotos: async (parent, args, { db }) =>
        await db
            .collection('photos')
            .find()
            .toArray(),
    totalUsers: async (parent, args, { db }) =>
        await db
            .collection('users')
            .countDocuments(),
    allUsers: async (parent, args, { db }) =>
        await db
            .collection('users')
            .find()
            .toArray(),
};

module.exports = Query;
