const { Post } = require('../models');

const postData = [
    {
        title: 'First Post',
        content: 'This is the content of the first post.',
        userId: 1
    },
    {
        title: 'Second Post',
        content: 'This is the content of the second post.',
        userId: 2
    }
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;