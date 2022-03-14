//this model is apis related to user login and signup





const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const LoginHistory = require('../models/loginhistory');
const router = new express.Router();



//sign up api to register a new user
router.post('/user/signup', async (req, res)=>{
	try{
		var user = new User({
			username: req.body.username,
			password: jwt.sign(req.body.password, process.env.TOKEN_SECRET)
		});
		var toekn = jwt.sign({_id: user._id.toString}, process.env.TOKEN_SECRET);

		user = await user.save();
		var authtoken = {
			authenticationToken: token
		};
		res.send(authtoken);
	}catch(e){
		res.send(e);
	}
});


//login api this api will provide the authentication token for the registered user if user is providing incorrect details it will return invalid credentials
router.post('/user/login', async(req, res)=>{
	try{
		var usr = await User.findOne({username: req.body.username});
		console.log(req.socket.remoteAddress);
		if(usr){
			var pwd = jwt.verify(usr.password, process.env.TOKEN_SECRET);
			if(pwd==req.body.password){
				usr = usr.toObject();
				console.log(usr);
				var token = jwt.sign({_id:usr._id.toString()}, process.env.TOKEN_SECRET);
				var authtoken = {
					authenticationToken: token
				};

				

				var history = new LoginHistory({
					"user": req.body.username,
					"ip": req.socket.remoteAddress
				});
				// var url="https://encrusxqoan0b.x.pipedream.net";
				// const dataupdated = await axios.post(url, history);
				history = await history.save();

				
				// console.log(dataupdated);
				res.send(authtoken);
			}else{
				res.send("invalid credentials");
			}
				
		}else{
			res.send("invalid credentials");
		}
		
	}catch(e){
		res.send(e);
	}
});






module.exports = router;