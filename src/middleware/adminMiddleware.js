const adminAuthMiddleware = (req, res, next) => {
  const user = req.body.user;
  console.log({ user });
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  next();
};

module.exports = { adminAuthMiddleware };
