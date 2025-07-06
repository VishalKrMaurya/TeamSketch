# CoSketch - Collaborative Whiteboard

## Setup Instructions
```bash
# Frontend
cd client
npm install
npm start

# Backend
cd server
npm install
npm start
```

## REST API Endpoints
- `POST /api/rooms/join` – Join or create a room
- `GET /api/rooms/:roomId` – Get room data

## Socket Events
### Client → Server
- `join-room` `{ roomId }`
- `draw` `{ x0, y0, x1, y1, color, strokeWidth, roomId }`
- `clear-canvas` `{ roomId }`
- `cursor-move` `{ x, y, roomId }`
- `request-replay` `{ roomId }`

### Server → Client
- `draw` – Broadcast stroke
- `clear-canvas` – Broadcast clear
- `update-cursor` – Broadcast user cursor
- `remove-user` – User left
- `user-count` – Total users
- `load-drawing-data` – Send stored strokes

## Architecture Overview
- **Frontend:** React w/ Canvas, Socket.io-client
- **Backend:** Express, Socket.io, MongoDB
- **Persistence:** MongoDB stores all drawing and clear events

## Deployment
- Host frontend (e.g., Vercel/Netlify)
- Host backend (Render/Heroku)
- Use environment variables for MongoDB & CORS origin
