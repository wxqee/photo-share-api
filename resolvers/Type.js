const {GraphQLScalarType} = require('graphql')
const { users, photos, tags } = require('./fixtures')

const Type = {
    Photo: {
        id: parent => parent.id || parent._id,
        url: parent => `/img/photos/${parent.id}.jpg`,
        postedBy: (parent, args, { db }) =>
            db
                .collection('users')
                .findOne({ githubLogin: parent.userID }),
        taggedUser: parent => tags
            .filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userID)
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: (parent, args, { db }) =>
            db
                .collection('photos')
                .find({ userID: parent.githubLogin })
                .toArray(),
        inPhotos: parent => tags
            .filter(tag => tag.userID === parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id === photoID))
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast.value,
    })
}

module.exports = Type;
