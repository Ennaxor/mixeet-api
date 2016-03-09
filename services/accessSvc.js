var User = require('../models/user');

module.exports = {
	authorize: function(req, res, next){
	var u_model = User;
	var bearerHeader = req.headers["authorization"];
	if(bearerHeader){
		var bearer = bearerHeader.split(" ");
		var type = bearer[0];
		var token = bearer[1];

		u_model.findOne({token:token})
				.exec(function(err, user){
					if (err) res.status(500).json({message:"MongoDB Error"});
					else{
						if(user){
							req.user = user;
							if(user.token_expiry_date > (new Date())) next();
							else res.status(404).json({message:"Token expired"});
						}
						else{
							res.status(401).json({message:"Wrong Auth Data"});
						}
					}
				})
	}
	else{
		res.status(400).json({message:"Auth Data Missing"});
	}
	}


}