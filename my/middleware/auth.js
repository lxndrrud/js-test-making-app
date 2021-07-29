const jwt = require("jsonwebtoken");
require('dotenv').config();

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.signedCookies["TOKEN"] || req.cookies["TOKEN"] || req.headers["TOKEN"];
  // console.log(`token=${token}`);

  if (!token) {
    //return res.status(403).send("Сессия закончилась! Выполните вход.");
    //res.clearCookie('TOKEN');
    return res.render('authFail');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    console.log(decoded);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;