const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/product');

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
    image: Array.isArray(image) ? image : (image ? [image] : []),
    material: Array.isArray(material) ? material : (material ? [material] : []),
    dimensions,
    stock: Number(stock) || 0,
    story,
    model3D,
    status: status || 'available'
  });

  res.status(201).json({
    message: "Product Created Successfully",
    product: newProduct
  });
});

const getAllProducts = asyncHandler(async(req, res) => {
  const allProducts = await Product.find({})
    .populate('artistId', 'name email location craft artForm bio story profileImage experience')
    .sort({ createdAt: -1 });

  res.status(200).json({
    product: allProducts,
    products: allProducts
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const foundProduct = await Product.findById(productId)
    .populate('artistId', 'name email location craft artForm bio story profileImage experience');

  if (!foundProduct) {
    return res.status(404).json({
      message: "Product not found"
    });
  }
  res.status(200).json({
    product: foundProduct
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const artistId = req.user._id;
  const foundProduct = await Product.findById(productId);
  if (!foundProduct) {
    return res.status(404).json({
      message: "Product Not Found"
    });
  }
  if (foundProduct.artistId.toString() !== artistId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to modify this product"
    });
  }

  const updateData = { ...req.body };
  delete updateData.artistId; // Prevent changing artist ownership
  updateData.updatedAt = Date.now();

  if (updateData.image !== undefined) {
    updateData.image = Array.isArray(updateData.image)
      ? updateData.image
      : (updateData.image ? [updateData.image] : []);
  }

  if (updateData.material !== undefined) {
    updateData.material = Array.isArray(updateData.material)
      ? updateData.material
      : (updateData.material ? [updateData.material] : []);
  }

  if (updateData.stock !== undefined) {
    updateData.stock = Number(updateData.stock) || 0;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate('artistId', 'name email location craft artForm bio story profileImage experience');

  res.status(200).json({
    message: "Product updated Successfully",
    product: updatedProduct
  });
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