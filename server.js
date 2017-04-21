var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user');
var apiRoutes = require('./routes')

var port = process.env.PORT || 8080;

var router = express.Router()

mongoose.connect('mongodb://localhost/auth-tokens-api');
app.set('superSecret',config.secret);

//body Parser to get info from POST and/or Url parameters
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'))//used to log requests to the console


app.use('/api',apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
