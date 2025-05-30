import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(
      token, 
      process.env.JWT_SECRET 
    );
    
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const optional = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(
      token, 
      process.env.JWT_SECRET 
    );
    
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    next();
  }
};