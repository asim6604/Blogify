const express = require('express');
const { createHmac } = require('node:crypto'); // Correctly import createHmac
const user = require('../Models/user.js');

const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body; // Ensure variable names match the input

    try {
        // Find the user by email
        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        // Retrieve stored salt and password hash
        const { salt, password: storedHashedPassword } = userExist;

        // Hash the entered password with the retrieved salt
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

        // Compare the hashed entered password with the stored hashed password
        if (hashedPassword !== storedHashedPassword) {
            return res.status(400).send({ message: 'Incorrect password' });
        }

        // If password matches, proceed with the login (you can set session or JWT here)
        res.send({ message: 'Sign-in successful' });

    } catch (error) {
        // Handle errors
        console.error('Sign-in error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Create user will trigger the pre-save hook to hash the password
        await user.create({ name, email, password });
        return res.redirect('/user'); // Redirect or respond accordingly

    } catch (error) {
        // Handle errors, such as duplicate email
        console.error('Signup error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
