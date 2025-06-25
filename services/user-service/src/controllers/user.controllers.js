const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Registration includes email, password and name' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            name, 
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful',
        });
    }
    catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error'
            });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) {
            return res.status(400).json({ message: 'Login includes email, password' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }

        if(! (await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid Password'});
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({
            message: 'Login successful',
            accessToken,
        }); 
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProfile = async (req, res) => {
    try {
        const id = req.user.userId; 
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true }
    );

    res.json({ message: 'Update Successful' });
  } catch (err) {
    res.status(400).json({ message: 'Update Error', error: err.message });
  }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
}