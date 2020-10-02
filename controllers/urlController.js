const URL = require('./../models/urlModel');
const User = require('./../models/userModel');

exports.createUrl = async (req, res, next) => {
	let newUrl;
	let { url, slug, isPrivate } = req.body;
	const user = await User.findOne({ userIp: req.ip });
	try {
		if (slug) {
			newUrl = await URL.create({
				fullURL: url,
				slug: slug,
				user: user._id,
				isPrivate: isPrivate,
			});
		} else {
			newUrl = await URL.create({
				fullURL: url,
				user: user._id,
				isPrivate: isPrivate,
			});
		}
		res.status(201).json({
			status: 'success',
			url: newUrl.fullURL,
			slug: newUrl.slug,
			clicks: newUrl.clicks,
			isPrivate: newUrl.isPrivate,
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
	const { slug, privateSlug } = req.params;
	try {
		const query = await URL.findOne({ slug });
		if (query) {
			if (privateSlug && query.user.userIp === req.ip && query.isPrivate) {
				const clicks = query.clicks + 1;
				res.redirect(query.fullURL);
				await URL.findByIdAndUpdate(query._id, { clicks });
			} else if (slug && !privateSlug && !query.isPrivate) {
				const clicks = query.clicks + 1;
				res.redirect(query.fullURL);
				await URL.findByIdAndUpdate(query._id, { clicks });
			} else {
				res.redirect(`/error/privateSlug`);
			}
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
			res.status(200).json({
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
