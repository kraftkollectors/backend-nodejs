const jwt = require("jsonwebtoken");
const { SESSION_SECRET } = require('../config')
const Admin = require('../models/admin')
const User = require('../models/users')


const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["Authorization"];
  
    if (!token) {
      return res.status(403).json({ message: "A token is required for authentication" })
    }
    
    const decoded = jwt.verify(token, SESSION_SECRET);
    if(decoded.id){

      if(decoded.type === 'admin'){

        const admin = await Admin.findById(decoded.id);
        if(admin) {
          req.admin = admin;
          next();
        }else{
          return res.status(401).json({ message: "Invalid Token" })    
        }

      }else if (decoded.type === 'user'){

        const user = await User.findById(decoded.id);
        if(user) {
          req.user = user;
          next();
        }else{
          return res.status(401).json({ message: "Invalid Token" })    
        }

      }else{
        return res.status(403).json({ message: "unidentified user" })
      }

    }else{
      return res.status(403).json({ message: "authentication error" })
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" })
  }
    
  };
  
export default verifyToken;