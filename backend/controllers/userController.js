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

  console.log(res.json)
  
})

export {authUser, getUserProfile}