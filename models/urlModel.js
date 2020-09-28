const mongoose = require('mongoose');
const validator = require('validator');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
	fullURL: {
		type: String,
		required: [true, 'Must have a URL to shorten.'],
		validate: [validator.isURL, 'Please provide a valid url'],
	},
	slug: {
		type: String,
		unique: [true, 'Slug already in use'],
		default: shortid.generate,
		validate: {
			validator: function (val) {
				return val.match(/^[\w\-]+$/i) ? true : false;
			},
			message: 'Invalid slug',
		},
	},
	clicks: {
		type: Number,
		required: [true, 'Number of clicks are required.'],
		default: 0,
	},
});

urlSchema.index({ slug: 1 });

urlSchema.pre('save', function (next) {
	this.slug = this.slug.toLowerCase();
	next();
});

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
