const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.cookies.access_token || req.headers["authorization"];

    if (!token) {
        return res.status(400).json({ message: 'Unauthorized' })
      }
    
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })
    
        req.user = user;
        // console.log(user)
        next();
      });
};

module.exports = { verifyToken };