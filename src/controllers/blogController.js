const fs = require('fs');
const { blogsUploadOptions, cloudinary } = require('../config/cloudinaryConfig');
const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  const { text, title, user_id, type_id } = req.body;

  const newImage = req.file.path;
  const nameImageDelete = req.file.filename;

  try {
    const { public_id, url } = await cloudinary.uploader.upload(
      newImage,
      blogsUploadOptions
    );

    const newBlog = {
      text,
      title,
      user_id,
      type_id,
      image: url,
      id_image: public_id,
    };
    const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
    await fs.promises.unlink(routeImageDelete);

    const blog = new Blog(newBlog);
    await blog.save();
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getAllBlog = async (req, res) => {
  const { title } = req.query;
  try {
    const blogs = await Blog.find({});

    if (!title) return res.status(200).json({ blogs });

    const blogFilter = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!blogFilter.length) throw new Error('no blog found');

    return res.status(200).json({ blogFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.updateBlog = async (req, res) => {
  const id = req.params.id;
  const { text, title, image, user_id, status, type_id, id_image } = req.body;
  try {
    const newImageUrl = req.file.path;
    const nameImageDelete = req.file.filename;

    await cloudinary.uploader.destroy(id_image);
    const { public_id, url } = await cloudinary.uploader.upload(newImageUrl, {
      ...blogsUploadOptions,
    });

    const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
    await fs.promises.unlink(routeImageDelete);

    const newData = {
      text,
      title,
      image,
      user_id,
      status,
      type_id,
      image: url,
      id_image: public_id,
    };

    const condition = await Blog.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('blog not found');
    return res.status(200).json({ message: 'Blog has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const isRemovedCorrect = await Blog.findOneAndRemove({ _id: id });
    if (!isRemovedCorrect) throw new Error('the blog does not exist');

    return res
      .status(200)
      .json({ message: `the blog with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getBlogDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');

    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
