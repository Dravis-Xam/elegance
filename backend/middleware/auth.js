// middleware/authenticateToken.js

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || "BDJBGJSBGKJ_AHKJBDKJ";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log("Token:", token);
  if (token === undefined || token === '') {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }

};
