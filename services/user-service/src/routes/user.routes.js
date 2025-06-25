const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;