// Chat client
const socketUrl = (window.location.origin).replace(/^http/, 'ws');

let token = localStorage.getItem('tfd_token') || null;

const socket = io({
  auth: { token }
});

const room = 'global';
const messagesEl = document.getElementById('messages');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

// Join room after connect
socket.on('connect', () => {
  socket.emit('joinRoom', room);
});

socket.on('roomHistory', (messages) => {
  messagesEl.innerHTML = '';
  messages.forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

socket.on('newMessage', (msg) => {
  renderMessage(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

socket.on('onlineUsers', (users) => {
  // optional: show online users
  console.log('online users', users);
});

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
  const content = input.value.trim();
  if (!content) return;
  socket.emit('sendMessage', { room, content });
  input.value = '';
}

function renderMessage(msg) {
  const div = document.createElement('div');
  div.className = 'message';
  const name = msg.sender && msg.sender.name ? msg.sender.name : (msg.name || 'Guest');
  const time = new Date(msg.createdAt || Date.now()).toLocaleTimeString();
  div.innerHTML = `<div class="meta"><strong>${escapeHtml(name)}</strong> <span class="time">${time}</span></div><div class="body">${escapeHtml(msg.content)}</div>`;
  messagesEl.appendChild(div);
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/\"/g, "&quot;")
       .replace(/'/g, "&#039;");
}
