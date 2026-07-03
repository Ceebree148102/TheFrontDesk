const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve static frontend (the site is static in repo)
app.use(express.static(''));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Simple in-memory map of online users (socketId -> user)
const onlineUsers = new Map();

// Authenticate socket using token passed in query: ?token=...
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(); // allow unauthenticated for public chat
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return next(new Error('Authentication error'));
    socket.user = user;
    next();
  } catch (err) {
    next(); // don't block if token invalid; treat as guest
  }
});

io.on('connection', (socket) => {
  const user = socket.user || { name: 'Guest', _id: null };
  onlineUsers.set(socket.id, user);

  // broadcast online users
  io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => ({ id: u._id, name: u.name })));

  socket.on('joinRoom', async (room) => {
    socket.join(room);
    // Load last 50 messages
    const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(200).populate('sender', 'name');
    socket.emit('roomHistory', messages);
  });

  socket.on('sendMessage', async ({ room, content }) => {
    try {
      const msg = new Message({ room, content, sender: user._id || undefined });
      await msg.save();
      const populated = await msg.populate('sender', 'name');
      io.to(room).emit('newMessage', populated);
    } catch (err) {
      console.error('sendMessage error', err);
    }
  });

  socket.on('typing', ({ room, typing }) => {
    socket.to(room).emit('typing', { user: user.name, typing });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => ({ id: u._id, name: u.name })));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
