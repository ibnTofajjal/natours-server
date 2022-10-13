const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const tourRouter = require('./Routes/tourRoutes');
const usersRouter = require('./Routes/usersRoutes');

// MIDDLEWARES =============================
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware ✋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mounting Router

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

// ------------------------------
module.exports = app;
