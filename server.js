var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;

var configDB = require('./config/database.js');

//MONGODB & MONGOOSE
var mongoose = require('mongoose');
mongoose.connect(process.env.DB);

app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// routes ======================================================================
require('./router.js')(app); // load our routes and pass in our app and fully configured passport


http.listen(port, function(){
  console.log('listening on *:'+port);
});
