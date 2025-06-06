var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
var sequelize = require('./db');
const { syncDatabase } = require('./db');
const { connectRedis } = require('./redis/client');

dotenv.config()
var port = process.env.PORT || 8080

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var itemsRouter = require('./routes/items');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');

var app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',                        
    'http://frontend:3000',                         
    'http://frontend.default.svc.cluster.local:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

async function initializeApp() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await syncDatabase();
    await connectRedis();
    
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

module.exports = app;
