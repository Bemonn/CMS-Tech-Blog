const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// Relationships
// A user has many posts
Post.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

// A post can have many comments
// A comment belongs to one user and one post
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "SET NULL",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "SET NULL",
});

// Export models and their associated relationships
module.exports = { User, Post, Comment };