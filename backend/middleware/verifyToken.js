require("dotenv").config();
const jwt = require("jsonwebtoken")

async function verifyToken(req, res, next){

  try{

    const token = req.headers['authorization']?.split(" ")[1];

    if(!token){
      return res.status(400).json({success: false, message: "jwt token not found"})
    }

    const user = await jwt.verify( token, process.env.JWT_SECRET_KEY );

    req.user = user;

    next();

  } catch(err){
    res.status(500).json({success: false, message: "Error at token verification", error: err.message })
  }

}

module.exports = verifyToken