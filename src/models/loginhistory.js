const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
	username: {
		type:String,
		required: true,

	},
	ipaddress: {
		type: String,
	}
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;