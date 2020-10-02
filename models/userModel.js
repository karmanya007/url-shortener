const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	userIp: {
		type: String,
		required: [true, 'A user must have an ip address'],
		validate: [validator.isIP, 'Your IP address is altered!!'],
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
