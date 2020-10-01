const URL = require('./../models/urlModel');

exports.getUrl = async (req, res, next) => {
	let newUser;
	let { url, slug } = req.body;
	console.log({ url, slug });
	try {
		if (slug) {
			newUser = await URL.create({ fullURL: url, slug: slug, userIp: req.ip });
		} else {
			newUser = await URL.create({ fullURL: url, userIp: req.ip });
		}
		res.status(201).json({
			status: 'success',
			url: newUser.fullURL,
			slug: newUser.slug,
			clicks: newUser.clicks,
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteUrl = async (req, res, next) => {
	try {
		const url = await URL.findByIdAndDelete(req.params.id);
		if (!url) return alert('Could not find this url!?');
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.redirect = async (req, res, next) => {
	const slug = req.params.slug;
	try {
		const query = await URL.findOne({ slug });
		if (query) {
			const clicks = query.clicks + 1;
			res.redirect(query.fullURL);
			await URL.findByIdAndUpdate(query._id, { clicks });
		} else {
			res.redirect(`/error/${slug}`);
		}
	} catch (error) {
		res.redirect(`/error/${slug}`);
	}
};

exports.checkSlug = async (req, res, next) => {
	const slug = req.params.slug;
	try {
		const query = await URL.findOne({ slug });
		if (query) {
			res.status(400).json({
				status: 'Invalid',
				message: 'Slug already exists. Try another one.',
			});
		} else {
			res.status(200).json({
				status: 'success',
				message: 'This slug is available.',
			});
		}
	} catch (err) {
		next(err);
	}
};
