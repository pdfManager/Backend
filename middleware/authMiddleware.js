const jwt = require('jsonwebtoken');
const jwtSecret = "MynameisHariompatelIloveyou";

const authMiddleware = (req, res, next) => {
    // console.log("reaquest parameters",req.headers);
    // console.log("req.user", req);
  const token = req.headers.authorization;
  // console.log(token);


  if (!token) {
    return res.status(401).json({ "error_token_empty" : 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.userId; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
