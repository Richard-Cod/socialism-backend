var jwt = require('jsonwebtoken');

const authMiddleware  = (req , res , next) => {
    jwt.verify(req.headers.token, process.env.JWT_PASS, function(err, decoded) {
        if (err) 
         return res.status(401).send({message : "UNAUTHORIZED" , error : err})
        
        req.user = decoded.data
        next()
      });
    
}
module.exports = authMiddleware