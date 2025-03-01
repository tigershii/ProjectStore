var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const Users = require('../models/users');

router.get('/verifySession', authenticateToken, async (req, res) => {
    try {
        const user = await Users.findOne({ where: { userId: req.user.userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Session verified', user: { id: user.userId, username: user.username } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Session verification failed' });
    }
});

router.get('/allUsers', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// User is database, not implemented yet
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await Users.findOne({ where: { username } });

        if (user !== null) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
        };

       // await newUser.save();
        await Users.create(newUser);
        res.status(201).json({ message: 'User registered successfully', username: newUser.username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { username, password} = req.body;
        //change later
        const user = await Users.findOne({ where: { username } });
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


