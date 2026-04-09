const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const cors     = require('cors');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGIN, methods: ['GET', 'POST'] },
  pingTimeout: 60000,
});

// ── In-memory room state ──
// rooms[roomId] = { teacherSocketId, students: { socketId → userId } }
const rooms = {};

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Learnwood Signaling Server' }));

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUserId = null;
  let currentRole = null;

  // ── Join room ──
  socket.on('join-room', (roomId, userId, role, clientSocketId) => {
    currentRoom   = roomId;
    currentUserId = userId;
    currentRole   = role;

    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = { teacherSocketId: null, students: {} };

    if (role === 'teacher') {
      rooms[roomId].teacherSocketId = socket.id;
      // If students are already in the room waiting, tell the newly joined teacher about them
      // so the teacher can initiate WebRTC offers!
      const studentsInRoom = Object.entries(rooms[roomId].students);
      studentsInRoom.forEach(([studentSocketId, studentUserId]) => {
         socket.emit('user-connected', studentUserId, 'student', studentSocketId);
      });
    } else {
      rooms[roomId].students[socket.id] = userId;
    }

    // Notify everyone else in the room with the joining socket's id
    socket.to(roomId).emit('user-connected', userId, role, socket.id);
    console.log(`[Room ${roomId}] ${role} ${userId} connected (socket: ${socket.id})`);
  });

  // ── WebRTC Signaling — route by target socketId ──
  socket.on('offer', (payload) => {
    // payload: { target: socketId, callerSocketId, sdp }
    io.to(payload.target).emit('offer', {
      ...payload,
      callerSocketId: socket.id,
    });
  });

  socket.on('answer', (payload) => {
    // payload: { target: socketId, callerSocketId, sdp }
    io.to(payload.target).emit('answer', {
      ...payload,
      callerSocketId: socket.id,
    });
  });

  socket.on('ice-candidate', (incoming) => {
    // incoming: { target: socketId, candidate }
    io.to(incoming.target).emit('ice-candidate', {
      fromSocketId: socket.id,
      candidate: incoming.candidate,
    });
  });

  // ── Raise / Lower Hand ──
  socket.on('raise-hand', (roomId, userId) => {
    if (rooms[roomId]?.teacherSocketId) {
      io.to(rooms[roomId].teacherSocketId).emit('hand-raised', userId, socket.id);
    }
  });

  socket.on('lower-hand', (roomId, userId) => {
    if (rooms[roomId]?.teacherSocketId) {
      io.to(rooms[roomId].teacherSocketId).emit('hand-lowered', userId);
    }
  });

  // ── End class (teacher only) ──
  socket.on('end-class', (roomId) => {
    if (rooms[roomId]?.teacherSocketId === socket.id) {
      socket.to(roomId).emit('class-ended');
      console.log(`[Room ${roomId}] Class ended by teacher`);
    }
  });

  // ── Disconnect cleanup ──
  socket.on('disconnect', () => {
    if (!currentRoom || !rooms[currentRoom]) return;

    console.log(`[Room ${currentRoom}] ${currentRole} ${currentUserId} disconnected`);

    if (currentRole === 'teacher') {
      // Teacher left — notify all students and clean room
      socket.to(currentRoom).emit('class-ended');
      delete rooms[currentRoom];
    } else {
      delete rooms[currentRoom]?.students[socket.id];
      socket.to(currentRoom).emit('user-disconnected', currentUserId, socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Signaling server running on port ${PORT} | CORS: ${ALLOWED_ORIGIN}`);
});
