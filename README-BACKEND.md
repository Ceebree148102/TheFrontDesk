# TheFrontDesk - Backend

This backend provides authentication, message storage, and real-time chat via Socket.io.

## Environment variables (.env)
Create a `.env` file (see `.env.example`) with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

## Run (production)

```bash
npm start
```

## Endpoints

- POST /api/auth/register  { name, email, password }
- POST /api/auth/login     { email, password }
- GET  /api/messages/:room  (optional auth)

## Socket.io

Connect with token via `auth` handshake:

client:

```js
const socket = io({ auth: { token: '<JWT>' } });
```

Events:
- joinRoom (room)
- sendMessage ({ room, content })
- typing ({ room, typing })
- onlineUsers (server emits)
- roomHistory (server emits existing messages)
- newMessage (server emits new message)

## Deployment

You can deploy to Railway, Render, Heroku, or any Node host. Ensure `MONGO_URI` and `JWT_SECRET` are set in environment.
