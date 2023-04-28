const { sign } = require("jsonwebtoken");

//create a web token when user logs in
const createToken = (user) => {
  const accessToken = sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  return accessToken;
};

/* //save for stretch-goal
const createRefreshToken = (user) => {
  const refreshToken = sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3m",
    }
  );
}; */

module.exports = { createToken };
