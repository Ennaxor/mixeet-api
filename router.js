var express = require('express');

var userCtrl = require('./controllers/userCtrl');

var auth = require('./services/accessSvc');

module.exports = function(app) {
	var users = express.Router();

	//TEST
	app.get('/test', function(req, res){
		res.json({msg:'Funcionando...'});
	})
	

	//USERS
	app.use('/users', users);

	users.get('/signin', userCtrl.signin);
	users.get('/me', userCtrl.me);
	users.get('/:email', userCtrl.info);
	users.post('/me/modify', auth.authorize, userCtrl.modify);
	users.post('/location/new', auth.authorize, userCtrl.newlocation);

	
}