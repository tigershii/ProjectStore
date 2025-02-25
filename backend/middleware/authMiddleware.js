var jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // First check for token in cookies
    let token = req.cookies.token;
    
    // If no cookie, check Authorization header
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
    }
    console.log('Token received: ', token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Decoded user: ', user);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;