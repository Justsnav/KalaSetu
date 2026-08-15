const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateToken(userId) {
    return jwt.sign(
        {userId : userId},
        env.jwtSecret,
        {expiresIn : env.jwtExpiresIn}
    )
};

module.exports = generateToken;