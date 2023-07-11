const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, price, stock, category, image, description } = req.body;
  const newProduct = { name, price, stock, category, image, description };

  try {
    const product = new Product(newProduct);
    await product.save();
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  const { title } = req.query;
  try {
    const products = await Product.find({});

    if (!title) return res.status(200).json({ products });

    const productFilter = products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!productFilter.length) throw new Error('no product found');

    return res.status(200).json({ productFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, stock, category, image, description } = req.body;
  const newData = { name, price, stock, category, image, description };
  try {
    const condition = await Product.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('product not found');
    return res.status(200).json({ message: 'Product has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const isRemovedCorrect = await Product.findOneAndRemove({ _id: id });
    if (!isRemovedCorrect) throw new Error('the product does not exist');

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
