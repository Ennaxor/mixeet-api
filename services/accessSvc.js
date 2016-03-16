var User = require('../models/user');

module.exports = {
	authorize: function(){
		return function(req, res, next){
			var u_model = User.model;
			var bearerHeader = req.headers["authorization"];
			var token = "";
			if(req.params.access_token){
				token = req.params.access_token;
			}
			else if(bearerHeader){
					var bearer = req.headers["authorization"].split(" ");
					if(bearer.length > 1) token = bearer[1];
					else{
						res.status(400);
						res.json({message:"Wrong auth data", status: 401});
						return;	
					}
				
			}
			else{ //IF NOT TOKEN OR SHIT
				if(options.strict){
					res.status(400);
					res.json({message:"Auth data missing", status: 400});
					return;
				}
	        	else{
	        		return next();	
	        	}
			}
			//IF TOKEN SET
			u_model.findOne({token:token})
			.then(function(result){
				req.user = result;
				if(user.token_expiry_date > (new Date())) next();
				else res.status(404).json({message:"Token expired"});
				return next();
			})
			.catch(function(err){
				console.log(err);
				res.status(403);
				res.json({message:"Unauthorized", status: 403});	
			})

		}
	}	


}