const jwt = require('jsonwebtoken');
const jwtSecret = "MynameisHariompatelIloveyou";

const authMiddleware = (req, res, next) => {
 console.log("Haan me chalra hu Middleware");

//   res.set({
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "*",
//     "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
// });
    // Enable CORS for all routes
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
