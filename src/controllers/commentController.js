const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  const { user_id, content, user_email, user_name, blog_id } = req.body;
  const newData = { user_id, content, user_email, user_name, blog_id };
  try {
    const comment = new Comment(newData);
    await comment.save();
    return res.status(200).json({ comment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getComment = async (req, res) => {
  const { blog_id } = req.query;
  try {
    const comments = await Comment.find({});

    if (!blog_id) return res.status(200).json({ comments });
    const commentFilter = comments.filter((comment) => comment.blog_id === blog_id);
    if (!commentFilter.length)
      throw new Error('The comment with that ID was not found');

    return res.status(200).json({ commentFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getCommentBlog = async (req, res) => {
  const blog_id = req.params.id;
  try {
    const comments = await Comment.find({ blog_id });

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) throw new Error('the comment does not exist');

    return res.status(200).json({ message: `Comment ${id} deleted` });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
