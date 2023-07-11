const Type = require('../models/Type');

exports.createType = async (req, res) => {
  const { name } = req.body;
  try {
    const type = new Type({ name });
    await type.save();
    return res.status(200).json({ type });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getTypes = async (req, res) => {
  const { name } = req.query;
  try {
    const types = await Type.find({});

    if (!name) return res.status(200).json({ types });

    const typeFilter = types.filter((type) =>
      type.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!typeFilter.length) throw new Error('no type found with that name');

    return res.status(200).json({ typeFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.getTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const type = await Type.findById(id);
    if (!type) throw new Error('type not found');

    return res.status(200).json({ type });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    const isRemovedCorrect = await Type.findOneAndRemove({ _id: id });
    if (!isRemovedCorrect) throw new Error('the blog does not exist');

    return res
      .status(200)
      .json({ message: `the type with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
