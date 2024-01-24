const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const { default: mongoose } = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({ subcategory });

  ctx.body = { products: products.map(product => mapProduct(product)) };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = { products: products.map(product => mapProduct(product)) };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    ctx.throw(404, 'Product not found');
  }

  ctx.body = { product: mapProduct(product) };
};

