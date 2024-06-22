// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./controller/uplodeController');
const multer=require("multer")
// const Post = require('./model/fileModel');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://aewaj:pathan123@cluster0.q7xcsqz.mongodb.net/fileUploads', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use((req, res, next) => {
  req.io = io;
  next();
});
// app.use(multer())




app.use('/', routes);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.set('io', io);

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
