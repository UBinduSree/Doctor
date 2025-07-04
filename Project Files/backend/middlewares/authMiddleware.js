const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res
        .status(401)
        .send({ message: "Authorization header missing", success: false });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: "Token not found", success: false });
    }

    console.log("Received token:", token); // Remove in production

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "Token is not valid", success: false });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};
