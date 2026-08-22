const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/product');
const product = require('../models/product');

const createProduct = asyncHandler(async (req, res) => {
  const artistId = req.user._id;

  const {
    title,
    description,
    price,
    category,
    artForm,
    image,
    material,
    dimensions,
    stock,
    story,
    model3D,
    status
  } = req.body;

  const newProduct = await Product.create({
    artistId,
    title,
    description,
    price,
    category,
    artForm,
    image,
    material,
    dimensions,
    stock,
    story,
    model3D,
    status
  });

  res.status(201).json({
    message: "Product Created Successfully",
    product: newProduct
  });
});

const getAllProducts = asyncHandler(async(req,res)=>{
  
  const  allProducts = await Product.find({})
  res.status(200).json({
    product : allProducts
  })
});

const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if(!product){
    return res.status(404).json({
      message : "Product not found"
    })
  }
  res.status(200).json({
    product
  })
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const artistId = req.user._id;
  const product = await Product.findById(productId);
  if(!product){
    return res.status(404).json({
      message : "Product Not Found"
    });
  }
  if(product.artistId.toString() !== artistId.toString()){
    return res.status(403).json({
      message : "You are not authorized to modify this product"
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    req.body,
    {
      new : true,
      runValidators : true
    }
  );
  res.status(200).json({
    message : "Product updated Successfully",
    product : updatedProduct
  })
});

const deleteProduct = asyncHandler(async (req,res)=>{
  const productId = req.params.id;
  const artistId = req.user._id;
  const product = await Product.findById(productId);
  if(!product){
    return res.status(404).json({
      message : "Product Not Found"
    });
  }

  if(product.artistId.toString() !== artistId.toString()){
    return res.status(403).json({
      message : "You are not authorized to modified this product"
    });
  }

  await Product.findByIdAndDelete(productId);
  res.json({
    message : "Product Deleted Sucessfully"
  })
  

})

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };