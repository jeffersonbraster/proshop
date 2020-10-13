import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async(req, res) => {
  const products = await Product.find({})
  res.json(products)
})


// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id)

  if(product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Produto não encontrado')
  }
})

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/admin
const deleteProduct = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id)

  if(product) {
    await product.remove()
    res.json({message: 'Produto removido.'})
  } else {
    res.status(404)
    throw new Error('Produto não encontrado')
  }
})

// @desc create a product
// @route post /api/products
// @access Private/admin
const createProduct = asyncHandler(async(req, res) => {
  const product = new Product({
    name: 'Nome do produto',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Marca do produto',
    category: 'Categoria do produto',
    countInStock: 0,
    numReviews: 0,
    description: 'Simples descrição'
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc update a product
// @route put /api/products/:id
// @access Private/admin
const updateProduct = asyncHandler(async(req, res) => {
  const {name, price, description, image, brand, category, countInStock} = req.body

  const product = await Product.findById(req.params.id)

  if(product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updateProduct = await product.save()
    res.json(updateProduct)
  }else {
    res.status(404)
    throw new Error('Produto não encontrado')
  }

  
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct
}