import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body
  
  const user = await User.findOne({email})

  if(user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  }else {
    res.status(401)
    throw new Error('invalid email or password')
  }
})

// @desc GET user Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async(req, res) => {    

  const user = await User.findById(req.user._id)

  if(!user) {
    res.status(404)
    throw new Error('user não encontrado')
  }

  res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
  })  
})


// @desc Update user Profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async(req, res) => {    

  const user = await User.findById(req.user._id)

  if(!user) {
    res.status(404)
    throw new Error('usuário não encontrado')
  }

  
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email

  if(req.body.password) {
    user.password = req.body.password
  }

  const updateUser = await user.save()
  
  res.json({
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
    isAdmin: updateUser.isAdmin,
    token: generateToken(updateUser._id)
  })
  
})

// @desc register new user
// @route Post /api/users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
  const {name, email, password} = req.body
  
  const userExist = await User.findOne({email})

  if(userExist) {
    res.status(400)
    throw new Error('Já existe um registro com esse E-mail')
  }

  const user = await User.create({
    name,
    email,
    password
  })

  if(user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }else {
    res.status(400)
    throw new Error('Dados invalidos, verifique.')
  }
})

// @desc GET  all user
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async(req, res) => {    

  const users = await User.find({})
  res.json(users)
})

// @desc DELETE  user
// @route delete /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async(req, res) => {    

  const user = await User.findById(req.params.id)
  if(user) {
    await user.remove()
    res.json({message: 'Usuário deletado'})
  }else {
    res.status(404)
    throw new Error('Usuário não existe')
  }
})

// @desc GET  user by id
// @route GET /api/users/:id
// @access Private/admin
const getUserById = asyncHandler(async(req, res) => {    

  const user = await User.findById(req.params.id).select('-password')
  if(user) {
    res.json(user)
  }else {
    res.status(404)
    throw new Error('Usuário não existe')
  }  
})

// @desc Update user 
// @route PUT /api/users/:id
// @access Private/admin
const updateUser = asyncHandler(async(req, res) => {    

  const user = await User.findById(req.params.id)

  if(!user) {
    res.status(404)
    throw new Error('usuário não encontrado')
  }

  
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  user.isAdmin = req.body.isAdmin

  const updateUser = await user.save()
  
  res.json({
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
    isAdmin: updateUser.isAdmin,
  })
  
})

export {authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser}