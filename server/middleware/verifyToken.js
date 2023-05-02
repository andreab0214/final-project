const { verify } = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ status: 401, message: "invalid user" });
  }

  try {
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("access-token");
        return res.status(401).json({ status: 401, message: "invalid user" });
      }
      req.user = decoded;
      console.log(req.user);
      return next();
    });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

module.exports = { validateToken };
