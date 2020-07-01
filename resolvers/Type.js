const {GraphQLScalarType} = require('graphql')
const { users, photos, tags } = require('./fixtures')

const Type = {
    Photo: {
        url: parent => Promise.resolve(`https://example.com/img/${parent.id}.jpg`),
        postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
        taggedUser: parent => tags
            .filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userID)
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubLogin),
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
