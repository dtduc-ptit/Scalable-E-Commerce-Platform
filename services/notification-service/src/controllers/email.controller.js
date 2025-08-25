const express = require('express');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.API_KEY);

const sendEmail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
    }

    const msg = {
        to,
        from: {
            email: process.env.FROM_EMAIL,
            name: process.env.FROM_NAME
        },
        subject,
        text,
        html: html || `<p>${text}</p>`
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

module.exports = {
  sendEmail
};