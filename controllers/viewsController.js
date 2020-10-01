const URL = require('./../models/urlModel');

exports.getOverview = async (req, res) => {
	const urls = await URL.find({ userIp: req.ip });
	console.log({ ip: req.ip, host: req.headers.host });
	res.status(200).render('index', { urls: urls, host: req.headers.host });
};

exports.getError = async (req, res) => {
	const slug = req.params.slug;
	res.render('slugNotFound', {
		slug: `${slug}`,
	});
};
