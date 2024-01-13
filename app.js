const express = require('express');
const session = require('express-session');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Configuración de express-session
app.use(session({
  secret: 'tu-secreto-aqui',
  resave: false,
  saveUninitialized: true
}));

app.use('/otraruta', (req, res, next) => {
  console.log('Sesión actual en otra ruta:', req.session);
  if (req.session && req.session.client) {
    console.log('Sesión del cliente en otra ruta:', req.session.client);
  }
  next();
});

// Configuración de vistas y otras middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejador de errores
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
