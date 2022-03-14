const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
	user: {
		type:String,
		required: true,

	},
	ip: {
		type: String,
	}
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;