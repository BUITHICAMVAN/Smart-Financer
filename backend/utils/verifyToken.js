const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;

  if (req.headers["authorization"] && req.headers["authorization"].startsWith('Bearer')) {
    token = req.headers["authorization"].split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      let errorMessage = 'Forbidden';
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
      }
      return res.status(403).json({ message: errorMessage });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
