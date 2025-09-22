const { verifyToken } = require('../utils/auth');

function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const payload = verifyToken(token);
    
    if (!payload) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    req.user = payload;
    next();
}

module.exports = { authenticate };