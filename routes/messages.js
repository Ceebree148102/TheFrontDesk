const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// GET /api/messages/:room
router.get('/:room', auth.optional, async (req, res) => {
  try {
    const room = req.params.room || 'global';
    const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(200).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
