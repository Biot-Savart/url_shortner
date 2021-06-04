const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const ShortURL = require('./src/models/url');
const cors = require('cors');
const _ =  require('lodash');

app.use([express.urlencoded({ extended: false }), cors()]);

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'URL Shortner API',
			version: '1.0.0'
		}
	},
	apis: ['api.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const validURL = function (str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}

/**
 * @swagger
 * /:
 *  get:
 *   description: Get all URLs
 *   responses:
 *    200:
 *     description: Success
 */
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

/**
 * @swagger
 * /short:
 *  post:
 *   description: Create a new shortened URL
 *   parameters:
 *    - name: fullUrl
 *      description: The URL to shorten
 *      in: query
 *      required: true
 *      type: string
 *   responses:
 *    201:
 *     description: Created
 */
app.post('/short', async (req, res) => {
	const fullUrl = req.query.fullUrl
	console.log('URL requested: ', fullUrl);

	const valid = validURL(fullUrl);

	if(!valid && fullUrl.length < 10) {
		res.json({error: "Invalid URL"});		
	}
	else {
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
	}	
});

/**
 * @swagger
 * /{shortid}:
 *  get:
 *   description: Get a short URL's original URL
 *   parameters:
 *    - name: shortid
 *      description: The ID of the short URL
 *      in: path
 *      required: true
 *      type: string
 *   responses:
 *    302:
 *     description: Success 
 */
app.get('/:shortid', async (req, res) => {
	// grab the :shortid param
	debugger;
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