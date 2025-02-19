var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const users = [{username: 'test', password: 'test', userId: "1"}, {username: 'test2', password: 'test2', userId: "2"}];

// User is database, not implemented yet
router.post('/signup', async (req, res) => {
    try {
        const { username, password} = req.body;
        //change later
        const user = users.find(user => user.username === username);
        console.log(user);
        if (user !== undefined) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword
        };

       // await newUser.save();
        users.push({username, password: hashedPassword, userId: users.length + 1});
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { username, password} = req.body;
        //change later
        const user = users.find(user => user.username === username);
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: `Username doesn't exist` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }


        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login failed' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/'
    });
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;


