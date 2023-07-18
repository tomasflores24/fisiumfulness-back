const adminAuthMiddleware = (req, res, next) => {
  const roleUser = req.headers.authorization;
  console.log({ roleUser });

  if (roleUser !== 'admin')
    return res.status(401).json({ message: 'Unauthorized access' });

  next();
};

module.exports = { adminAuthMiddleware };
