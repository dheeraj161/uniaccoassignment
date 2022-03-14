const express = require('express');
const LoginHistory = require('../models/loginhistory');
const router = new express.Router();

//this module is to provide login history of users

router.get('/loginhistory', async (req, res)=>{
	try{
		var history = await LoginHistory.find({});
		
		res.send(history);
	}catch(e){
		res.send(e);
	}
});






module.exports = router;