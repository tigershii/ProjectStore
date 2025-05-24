var jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => { 
    try{
        let token = req.cookies.token;
        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
        }
        

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("JWT verification error");
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Error verifying JWT token:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 


module.exports = authenticateToken;