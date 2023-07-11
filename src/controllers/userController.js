const User = require('../models/User');

exports.createUser = async (req, res) => {
  const {
    email,
    firstname,
    lastname,
    status,
    password,
    username,
    role,
    token,
    confirm,
    phone,
    latitud,
    longitud,
  } = req.body;
  const newData = {
    email,
    firstname,
    lastname,
    status,
    password,
    username,
    role,
    token,
    confirm,
    phone,
    latitud,
    longitud,
  };
  try {
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
    status,
    password,
    username,
    role,
    token,
    confirm,
    phone,
    latitud,
    longitud,
  } = req.body;
  const newData = {
    email,
    firstname,
    lastname,
    status,
    password,
    username,
    role,
    token,
    confirm,
    phone,
    latitud,
    longitud,
  };
  try {
    await User.findByIdAndUpdate({ _id: id }, newData);
    return res.status(200).json({ message: 'User has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndRemove({ _id: id });

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
