const jwt = require("jsonwebtoken");

exports.sendToken = (res, statuscode, user) => {
    
    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
        expiresIn: process.env.JWTEXPIRE,
    });

    const cookieOptions = {
        expire: Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true,
    };
console.log(user)
// next();
    // res.cookie("token", token, cookieOptions);
    //  res.status(200).json("login");

    res.status(statuscode).cookie("token", token, cookieOptions).redirect("/");
};