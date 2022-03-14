const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const LoginHistory = require('../models/loginhistory');
const router = new express.Router();




router.post('/user/signup', async (req, res)=>{
	try{
		var user = new User({
			username: req.body.username,
			password: jwt.sign(req.body.password, process.env.TOKEN_SECRET)
		});
		var toekn = jwt.sign({_id: user._id.toString}, process.env.TOKEN_SECRET);

		user = await user.save();
		user = user.toObject();
		console.log(user);
		console.log(user);
		res.send(user);
	}catch(e){
		res.send(e);
	}
});

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

				var logdata = {
					"user": req.body.username,
					"ip": req.socket.remoteAddress
				}
				console.log(logdata);

				var history = new LoginHistory({
					"username": req.body.username,
					"ipaddress": req.socket.remoteAddress
				});
				history = await history.save();

				// var url="https://encrusxqoan0b.x.pipedream.net";
				// const dataupdated = await axios.post(url, logdata);

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