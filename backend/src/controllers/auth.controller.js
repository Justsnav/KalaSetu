const asyncHandler = require('../utils/asyncHandler');
const user = require('../models/user');
const generateToken = require('../utils/generateToken');

//signup routes
const signup = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  const existingUser = await user.findOne({
    email : email
  });
  if(existingUser){
    return res.status(409).json({
        message : 'User with this email already exists.'
    })
  }

  const newUser = await user.create({
    name : name,
    email : email,
    password : password,
    role : role
  })

  const token = generateToken(newUser._id);

  return res.status(201).json({
    message : 'user created successfully',
    token
  })
});

//signin routes
const signin = asyncHandler(async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await user.findOne({email}).select('+password');
    if(!existingUser){
        return res.status(401).json({
            message : 'Incorrect Credential'
        })
    }
    const isMatch = await existingUser.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({
            message : 'Incorrect Credential'
        });
    }
    const token = generateToken(existingUser._id);
    res.json({
        token
    })
})

const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = { signup , signin, getMe};