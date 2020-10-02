const mongoose = require('mongoose');
const validator = require('validator');
const fnv = require('fnv-plus');
const { nanoid } = require('nanoid');

const CM = require('./counterModel');

const urlSchema = new mongoose.Schema({
	fullURL: {
		type: String,
		required: [true, 'Must have a URL to shorten.'],
		validate: [validator.isURL, 'Please provide a valid url'],
	},
	slug: {
		type: String,
		unique: [true, 'Slug already in use'],
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
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'A Url must have a user'],
	},
	isPrivate: { type: Boolean, default: false },
	privateSlug: {
		type: String,
	},
});

urlSchema.index({ slug: 1 });

urlSchema.pre('save', async function (next) {
	if (!this.slug) {
		const CQ = await CM.findOne();
		this.slug = fnv.hash(CQ.counter.toString(), 32).hex();
		CQ.save();
	}
	if (this.isPrivate) this.privateSlug = nanoid(4);
	next();
});

urlSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'userIp',
	});
	next();
});

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
