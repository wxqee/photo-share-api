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
    }
};

module.exports = Mutation;
