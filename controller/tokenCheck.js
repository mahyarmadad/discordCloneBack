const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.headers["authorization"];
  if (!token) return res.status(403).send("Token is required");
  try {
    if (token.includes("Bearer")) token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(500).send("Invalid Token");
  }

  next();
};

module.exports = verifyToken;
