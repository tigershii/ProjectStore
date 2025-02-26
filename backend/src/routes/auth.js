var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');


router.get('/verifySession', authenticateToken, async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE user_id = $1', [req.user.userId]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Session verified', user: { id: user.userId, username: user.username } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Session verification failed' });
    }
});

// User is database, not implemented yet
router.post('/signup', async (req, res) => {
    try {
        const { username, password} = req.body;
        //change later
        const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log(user);
        if (user !== undefined) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            userId: users.length + 1
        };

       // await newUser.save();
        await db.query('INSERT INTO users (username, password, user_id) VALUES ($1, $2, $3)', [newUser.username, newUser.password, newUser.userId]);
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.userId, username: newUser.username } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { username, password} = req.body;
        //change later
        const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log(user || "User not found");
        if (!user) {
            return res.status(400).json({ message: `Username doesn't exist` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // change to isPasswordValid
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }


        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({ message: 'Login successful', user: { id: user.userId, username: user.username } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login failed' });
    }
});

router.post('/logout', async(req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/'
    });
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;


