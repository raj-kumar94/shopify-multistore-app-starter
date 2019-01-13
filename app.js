const dotenv = require('dotenv').config();
const path = require("path");
const http = require("http");
const publicPath = path.join(__dirname,'/public');
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const hbs = require('hbs');
var cors = require('cors');
var helmet = require('helmet')

const express = require("express");
var session = require('express-session');



var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var DB = process.env.DB || 'test'
mongoose.connect('mongodb://localhost:27017/'+DB);

var app = express();

app.set('trust proxy', 'loopback');



// to verify shopify webhooks, raw body is required
// use this middleware before using bodyParser
app.use(function(req, res, next) {
  req.rawBody = '';

  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });

  next();
});


// adding security middleware
app.use(helmet());

app.use(cors({
  origin: '*',
  withCredentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Content-Type-Options', 'X-Frame-Options', 'Accept', 'Origin']
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));




// initialize express-session to allow us track the logged-in user across sessions.
require('./middlewares/sessionChecker').setupSession(app);

// register handlebars helper functions
require('./utils/handlerbars')(hbs);




// middleware function to check for logged-in users
var { isAdmin } = require('./middlewares/sessionChecker');

// for static files
app.use('/public',express.static(publicPath));

hbs.registerPartials(__dirname + '/views/partials')

// nodemon server/server.js will look for views directory parallel to server folder
// nodemon server.js will look for views directory parallel to server.js file
// app.set('views', './../views');
app.set('view engine', 'hbs');

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

const accessControlAllow = require('./middlewares/accessControlAllow');
app.use(accessControlAllow.allow);

const registerWebhooks = require('./routes/webhook');

const user = require('./routes/user');

const order = require('./routes/order');

const config = require('./routes/config');

app.use('/webhooks', registerWebhooks);
app.use('/user', user);
app.use('/order', order);
app.use('/store', config);
app.use('/', user);


// public app end points

// const { shopifyInit, ShopifyCallback } = require('./shopify/publicApp');
// app.get('/shopify', shopifyInit);
// app.get('/shopify/callback', ShopifyCallback);


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});