const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

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
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.get('/', (req, res) => {
	res.status(200).render('index');
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
		if (query) {
			res.redirect(query.fullURL);
		} else res.redirect(`/error/${slug}-not-found`);
	} catch (error) {
		res.redirect('/error/404');
	}
});

// All other routes
app.all('*', (req, res, next) => {
	next(`Can not find ${req.originalUrl} on this server!`);
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
