const { photos } = require('./fixtures');

const Query = {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
};

module.exports = Query;
