const { Comment } = require('../models');

const commentData = [
    {
        content: 'Great post, John!',
        user_id: 2,
        post_id: 1
    },
    {
        content: 'Thanks for sharing, Jane!',
        user_id: 1,
        post_id: 2
    }
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;