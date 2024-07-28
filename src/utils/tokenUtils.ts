import jwt from 'jsonwebtoken';

const generateToken = (user: any): string => {
  const { id, email, type } = user;
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id, email, type }, secret, { expiresIn: '1y' });
  return token;
};

export default generateToken;