const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./configs/database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const errorHandler = require('./middlewares/error');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

module.exports = app;
