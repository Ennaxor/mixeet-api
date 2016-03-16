//IMPORTS
var userModel = require('../models/user');

var express = require('express');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

/* RECUPERAMOS CREDENCIALES DE NUESTRA CONSOLA DEVELOPER */
var oauth2Client = new OAuth2('927674196118-l6i2kvibbp67g63hf0unvcu40552cntq.apps.googleusercontent.com', '49tddGVHoBgsf_rQ1ETgJlLg', 'https://mixeet.herokuapp.com/users/signin');

//var googleRedirect = process.env.GOOGLE_REDIRECT || config.googleRedirect;

module.exports = {
	//   users/signin
	signin: function(req, res){
		if(!req.query.code){
			var scopes = ['https://www.googleapis.com/auth/youtube.readonly',
		    			  'https://www.googleapis.com/auth/plus.me',
		    			  'https://www.googleapis.com/auth/plus.login',
		    		      'https://www.googleapis.com/auth/userinfo.email'
		    	         ];

		  	var url = oauth2Client.generateAuthUrl({
		  		access_type: 'online',
		  		scope: scopes
		  	});

		  	res.redirect(url);
		}else{
			oauth2Client.getToken(req.query.code, function(err, tokens){
				if(!err){
					var plus = google.plus('v1');
					var youtube = google.youtube('v3');

					oauth2Client.setCredentials({
						access_token: tokens.access_token
					});
					plus.people.get({userId: 'me', auth: oauth2Client }, function(err2, response){
						var email = response.emails[0].value.toLowerCase();
						var name = response.displayName;
						var image = response.image.url;

						userModel.user.signin(email, tokens.access_token, name, image, tokens.expiry_date, function(isregistered, token, err3){
							if(err3){
								return;
							} 
							else{
								res.redirect('https://mixeet-web.herokuapp.com/#/landing?token='+token);								
							}
						});


					});

					/*youtube.playlists.list({part: 'snippet', mine: true, auth: oauth2Client }, function(err,response){
						console.log(err);
						console.log(response);
						res.send("OK YUTUB");
					})
					youtube.subscriptions.list({part: 'snippet', mine: true, auth: oauth2Client }, function(err,response){
						console.log(err);
						console.log(response);
						res.send("OK YUTUB");
					})*/
				}
			});
		}
	},
	info: function(req, res, next){
		userModel.user.findOne({"email": req.params.email})
		.then(function(user){
			res.json(user);
		})
		.catch(function(err){
			res.status(404);
			res.json({msg:"User not found", status:404});	
			next();
		})	
	},
	me: function(req, res){
		res.json({msg:"show"});
		//res.json({email:req.user.email, name:req.user.name, image:req.user.image, location:req.user.location});
	},
	modify: function(req, res){
		req.user.name = req.body.name;
		req.user.save(function(err, res1){
			if(err) res.status(500).json({msg:'server error'});
			else res.status(200).json({msg:'ok'});
		});
	},
	newlocation: function(req, res){
		req.user.location = req.body.location;
		req.user.save(function(err, res1){
			if(err) res.status(500).json({msg:'server error'});
			else res.status(200).json({msg:'ok'});
		});
	}
}



