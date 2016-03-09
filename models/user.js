var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {type: String, required : true, index: {unique: true, dropDups: true} },
	//ACCESS TOKEN FROM GOOGLE
	token: {type: String, index: {unique: true, sparse: true} },
	name: String,
	image: String,
	location: String,
	created_at: Date,
  	updated_at: Date,
  	token_expiry_date: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
  var currentDate = new Date();  
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  next();
});

// DOCUMENT METHOD
userSchema.statics.signin = function(email, token, name, image, expirydate, callback){
	var user = this;
	var newuser = new user({
		email: email,
		token: token,
		name: name,
		image: image,
		token_expiry_date: expirydate
	});

	newuser.save(function(err,res){
		//TANTO COMO SI EXISTE COMO SI NO, LOGUEO AL USUARIO
		if(err){
			user.findOne({email:email})
				.exec(function(err2, user){
					if(err2) callback(true, token, {error:'server error'});
					else{
						if(!user) callback(true, token, {error:'server error - no user'});
						else{
							user.token = token;
							user.token_expiry_date = expirydate;
							user.save(function(err3, res2){
								if(err3) callback(true, token, {error:'server error'});
								else callback(true, token);
							});
						}
					}
				})
		} 
		else callback(false, token);
	});
}

//OBJECT METHODS
userSchema.methods.update_info = function(data){ //this = user
	var deferred = Q.defer();
	var user = this;
	user.name =  data.name;
	user.image = data.image;
	user.save(function(err){
		if(err) deferred.reject(new Error(err));
		else{
			deferred.resolve(user);
		}
	});	
	return deferred.promise;
}

var User = mongoose.model('User', userSchema);

/*var authorize = function(req, res, next){
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

}*/



//METHODS 
//...

module.exports = {
	user : User
	//authorize : authorize
}
	

