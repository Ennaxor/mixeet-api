var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var cors = require('cors');

var configDB = require('./config/database.js');

//MONGODB & MONGOOSE
var mongoose = require('mongoose');
mongoose.connect(process.env.DB);

/*CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}*/

app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(cors());
//app.use(allowCrossDomain);


/*app.use(function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
*/

// routes ======================================================================
require('./router.js')(app); // load our routes and pass in our app and fully configured passport


http.listen(port, function(){
  console.log('listening on *:'+port);
});
