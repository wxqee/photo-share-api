const fixtures = require('./fixtures')
const { photos } = fixtures

const Mutation = {
    postPhoto(parent, args) {
        var newPhoto = {
            id: fixtures._id++,
            ...args.input,
            created: new Date(),
        }
        photos.push(newPhoto)
        return newPhoto
    }
};

module.exports = Mutation;
