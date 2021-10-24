const jwt = require('jsonwebtoken');

const getJwt = (data) => jwt.sign({ data }, "ednlze" , { expiresIn: 60 * 60 * 24 }) ;
module.exports = getJwt