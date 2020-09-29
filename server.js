const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const hpp = require('hpp');

const URL = require('./models/urlModel');
const app = express();

mongoose
	.connect('mongodb://localhost/urlShortener', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database connected...'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
// app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

app.use(morgan('dev'));

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/url', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againsst XSS
app.use(xss());

app.use(hpp());

app.use(compression());

app.get('/', async (req, res) => {
	const urls = await URL.find();
	res.status(200).render('index', { urls: urls });
});
app.get('/error/:err', (req, res) => {
	const error = req.params.err;
	if (error === '404') res.render('404');
	else if (error.endsWith('-not-found'))
		res.render('slugNotFound', {
			slug: `${error.split('-')[0]}`,
		});
});

app.post('/url', async (req, res, next) => {
	let newUser;
	let { url, slug } = req.body;
	try {
		if (slug) {
			slug = slug.toLowerCase();
			newUser = await URL.create({ fullURL: url, slug: slug });
		} else {
			newUser = await URL.create({ fullURL: url });
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
});

app.get('/:slug', async (req, res, next) => {
	const slug = req.params.slug;
	try {
		const query = await URL.findOne({ slug });
		const clicks = query.clicks + 1;
		if (query) {
			res.redirect(query.fullURL);
			await URL.findByIdAndUpdate(query._id, { clicks });
		} else res.redirect(`/error/${slug}-not-found`);
	} catch (error) {
		res.redirect(`/error/${slug}-not-found`);
	}
});
app.delete('/:id', async (req, res, next) => {
	try {
		const url = await URL.findByIdAndDelete(req.params.id);
		if (!url) alert('Could not find this url!?');
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// Error handler
app.use((error, req, res, next) => {
	if (error.status) res.status(error.status);
	else res.status(500);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Listining on port ${process.env.PORT || 3000}`);
});
