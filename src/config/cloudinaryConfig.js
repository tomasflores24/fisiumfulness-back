const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const { cloud_name, api_key, api_secret } = process.env;
const cloudinaryCredentials = { cloud_name, api_key, api_secret };
cloudinary.config(cloudinaryCredentials);

const FOLDER_PRODUCTS = 'FisiumFulness/products';
const FOLDER_BLOGS = 'FisiumFulness/blogs';

const productsUploadOptions = {
  resource_type: 'image',
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  tags: ['product'],
  folder: FOLDER_PRODUCTS,
};
const blogsUploadOptions = {
  resource_type: 'image',
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  tags: ['blog'],
  folder: FOLDER_BLOGS,
};

module.exports = {
  cloudinary,
  cloudinaryCredentials,
  productsUploadOptions,
  blogsUploadOptions,
};
