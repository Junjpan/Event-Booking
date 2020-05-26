const jwt = require("jsonwebtoken");
require("dotenv").config();

//(req,res,next)=>{} is express.js middleware function profile
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");//or you can do req.headers.Authorization
  
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  } else {
    let decodeToken;

    try {
    decodeToken = jwt.verify(token, process.env.TOKEN);
    console.log(decodeToken);
    } catch (err) {
      throw err;
    }
    
    if(!decodeToken){
        req.isAuth = false;
        return next(); 
    }

    req.isAuth=true;
    req.userId=decodeToken.userId;
    return next()


  }
};
