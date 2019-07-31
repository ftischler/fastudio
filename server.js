require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./src/config/routes');
const db = process.env.DB;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(db, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
	console.log('Connected to database successfully');
});
mongoose.connection.on('error', (err) => {
	console.log('Database error: '+err);
});
const app = express();
const PORT = process.env.PORT  || 8080;

// enablling socket-io
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('./src/config/sockets')(io);

// enablling middleware
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

// cors config
const whitelist = ['http://www.fastudio.com.ng', 'http://localhost:4200'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger('dev'));
app.use('/v1', routes);

// enable for production
app.use(express.static(path.join(__dirname, 'client-side/dist/browser')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-side/dist/browser/index.html'));
});


// global error handeling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.message = 'Invaild route';
  // @ts-ignore
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
