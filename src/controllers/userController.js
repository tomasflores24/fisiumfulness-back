const fs = require('fs');
const { cloudinary, userUploadOptions } = require('../config/cloudinaryConfig');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  const {
    email,
    firstname,
    lastname,
    password,
    username,
    phone,
    latitud,
    longitud,
    role,
  } = req.body;

  try {
    const hasFile = !!req.file;
    let urlImage = undefined;
    let public_id_prueba = undefined;

    if (hasFile) {
      const newImage = req.file.path;
      const nameImageDelete = req.file.filename;
      const { public_id, url } = await cloudinary.uploader.upload(
        newImage,
        userUploadOptions
      );

      urlImage = url;
      public_id_prueba = public_id;

      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
    }

    const newData = {
      email,
      firstname,
      lastname,
      password,
      username,
      phone,
      latitud,
      longitud,
      role,
      image: urlImage,
      id_image: public_id_prueba,
    };

    const user = new User(newData);
    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getUser = async (req, res) => {
  const { email } = req.query;
  try {
    const users = await User.find({});
    if (!email) return res.status(200).json({ users });

    const userFilter = users.filter((user) =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
    if (!userFilter.length) throw new Error('user not found');

    return res.status(200).json({ userFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    email,
    firstname,
    lastname,
    password,
    username,
    phone,
    latitud,
    longitud,
    id_image,
  } = req.body;

  try {
    const hasFile = !!req.file;
    let newImage = undefined;
    let newIdImage = undefined;

    if (hasFile) {
      const newImageUrl = req.file.path;
      const nameImageDelete = req.file.filename;

      await cloudinary.uploader.destroy(id_image);
      const { public_id, url } = await cloudinary.uploader.upload(
        newImageUrl,
        userUploadOptions
      );
      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      email,
      firstname,
      lastname,
      password,
      username,
      phone,
      latitud,
      longitud,
      image: newImage,
      id_image: newIdImage,
    };
    await User.findByIdAndUpdate({ _id: id }, newData);
    return res.status(200).json({ message: 'User has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.statusUser = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const user = await User.findById( id );
    if (!user) throw new Error('the blog does not exist');

    user.status = status;
    await user.save();

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('the user does not exist');

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
