const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token é obrigatório' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Você não possui permissão para essa ação' });
    next();
  });

};

module.exports = { isAdmin };