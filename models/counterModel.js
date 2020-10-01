const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
	counter: {
		type: Number,
		required: [true, 'A Counter is a must!!'],
	},
});

counterSchema.pre('save', function (next) {
	this.counter = this.counter + 1;
	next();
});

const Counter = mongoose.model('COUNTER', counterSchema);

module.exports = Counter;
