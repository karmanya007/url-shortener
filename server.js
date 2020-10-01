const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err);
	console.log(err.name, err.message);
	process.exit(1);
});

const app = require('./app');

mongoose
	.connect('mongodb://localhost/urlShortener', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database connected...'));

const port = process.env.PORT || 1337;
app.listen(port, '192.168.1.6', () => {
	console.log(`Listining on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('(╬▔皿▔)╯ SIGTERM RECEIVED (╬▔皿▔)╯ . Shutting down...');
	server.close(() => {
		console.log('💢 Process terminated! 💢');
	});
});
