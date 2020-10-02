const URL = require('./../models/urlModel');
const User = require('./../models/userModel');
const Cm = require('./../models/counterModel');

exports.getOverview = async (req, res) => {
	let user;
	user = await User.findOne({ userIp: req.ip });
	userCount = (await User.find()).length;
	if (!user) {
		user = await User.create({ userIp: req.ip });
	}
	const urls = await URL.find({ user: user._id });
	res.status(200).render('index', {
		urls: urls,
		host: req.headers.host,
		userCount: userCount,
	});
};

exports.getError = async (req, res) => {
	const slug = req.params.slug;
	if (slug === 'privateSlug') {
		res.render('privateUrl');
	} else {
		res.render('slugNotFound', {
			slug: `${slug}`,
		});
	}
};
