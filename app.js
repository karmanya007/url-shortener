const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const hpp = require('hpp');

const urlRouter = require('./routes/urlRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

app.use(morgan('dev'));

const limiter = rateLimit({
	max: 50,
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

app.use(
	hpp({
		whitelist: ['slug'],
	})
);

app.use(compression());

app.use('/', viewRouter);
app.use('/url', urlRouter);

// Error handler
app.use((error, req, res, next) => {
	if (error.status) res.status(error.status);
	else res.status(500);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
	});
});

module.exports = app;
