import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import Admin from '../models/admin'
import User from '../models/users'


const JWT_SECRET: any = process.env.JWT_SECRET


const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).json({ message: "A token is required for authentication" })
    }
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
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