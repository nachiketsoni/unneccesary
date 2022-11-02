const errorHandler = require("../utils/errorHandler");
const AsyncErrors = require("../middleware/asyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isLoggedIn = AsyncErrors(async (req, res, next) => {
          const { token } = req.cookies;
        
          if (!token) {
            return res.redirect("/loginPage");
          }
        
          const data = jwt.verify(token, process.env.JWTSECRET);
        
          req.user = await User.findById(data.id);
        
          next();
        });