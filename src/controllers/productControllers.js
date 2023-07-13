const Product = require('../models/Product');
const {
  cloudinary,
  productsUploadOptions,
} = require('../config/cloudinaryConfig.js');

exports.createProduct = async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  const newImage = req.file.path;
  try {
    const { public_id, url } = await cloudinary.uploader.upload(
      newImage,
      productsUploadOptions
    );
    const newProduct = {
      name,
      price,
      stock,
      category,
      description,
      image: url,
      id_image: public_id,
    };
    const product = new Product(newProduct);
    await product.save();

    return res.status(200).json({ message: 'Create Product', product });
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
  const { name, price, stock, category, description } = req.body;
  try {
    const newImageUrl = req.file.path;
    const { id_image } = await Product.findById(id);
    await cloudinary.uploader.destroy(id_image);

    const { public_id, url } = await cloudinary.uploader.upload(newImageUrl, {
      ...productsUploadOptions,
    });
    const newData = {
      name,
      price,
      stock,
      category,
      description,
      image: url,
      id_image: public_id,
    };

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
