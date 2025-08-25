const express = require("express");
const router = express.Router();

const emailController = require('../controllers/email.controller');

router.post('/email', emailController.sendEmail);

module.exports = router;