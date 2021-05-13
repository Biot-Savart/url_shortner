const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortURL = require('./src/models/url');
const cors = require('cors');
const _ =  require('lodash');

app.use([express.urlencoded({ extended: false }), cors()]);

app.get('/', async (req, res) => {
	const allData = await ShortURL.find();
	res.json(allData);
});

app.get('/short', async (req, res) => {
	// insert the record using the model
	const record = new ShortURL({
		full: 'test'
	});
	await record.save();
	const data = {
		fullUrl: record.full,
		short: record.short
	};
	res.json(data);
});

app.post('/short', async (req, res) => {
	const fullUrl = req.query.fullUrl
	console.log('URL requested: ', fullUrl);

	let record = await ShortURL.findOne({ full: fullUrl })

	if (_.isNil(record)) {
		// insert the record using the model
		record = new ShortURL({
			full: fullUrl
		});
		await record.save();
	}
	const data = {
		fullUrl: fullUrl,
		short: record.short
	};

	res.json(data);
});

app.get('/:shortid', async (req, res) => {
	// grab the :shortid param
	const shortid = req.params.shortid;

	// perform the mongoose call to find the long URL
	const rec = await ShortURL.findOne({ short: shortid });

	// if null, set status to 404 (res.sendStatus(404))
	if (!rec) return res.sendStatus(404);

	// if not null, increment the click count in database
	rec.clicks++;
	await rec.save();

	// redirect the user to original link
	res.redirect(rec.full);
});



// Setup your mongodb connection here
mongoose.connect('mongodb+srv://dbUser:dbPass@cluster0.4qc2z.mongodb.net/url_shortner?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.on('open', () => {
	// Wait for mongodb connection before server starts
	app.listen(5000, () => {
		console.log("API server started on port 5000");
	});
})