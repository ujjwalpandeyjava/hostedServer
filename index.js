/*
 * Run: npm run start
 *    : npx nodemon ./index.js
 * Hot Reload run: "npx nodemon ./index.js"
 */

const express = require("express");
var cors = require('cors')
const app = express();
const path = require('path');
const fs = require('fs');

// Use for system configurations
const dotenv = require("dotenv")
dotenv.config();

const hostname = "127.0.0.1";
const port = process.env.PORT || 2000;

var allowlist = ['http://example1.com']
var corsOptions = (req, callback) => {
	var corsOptions;
	//   console.log("From: ", req.header('Origin'));
	if (allowlist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
	} else {
		corsOptions = { origin: false } // disable CORS for this request
	}
	//  corsOptions = { origin: true } // for all
	callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptions));

// Use routes
app.get("/", (req, res) => {
	res.send("Node Express server working");
});
app.use(express.json());
app.use('/contactActions', require('./router/contactActions'))
app.get(['/app1', '/app1/*'], function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'app1/index.html'));
});
app.get(['/app2', '/app2/*'], function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'app2/index.html'));
});
app.get(['/Portfolio', '/Portfolio/*'], function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'Portfolio/index.html'));
});
app.get('/availableApps', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'folderNames.json'));
});

// Response with a page, presenting list of available apps
app.get('/*', function (req, res) {
	const buildDir = path.join(__dirname, 'build');
	fs.readdir(buildDir, { withFileTypes: true }, (err, files) => {
		if (err) {
			console.error(err);
			res.status(500).send('Internal Server Error');
			return;
		}
		const availableApps = files.filter(file => file.isDirectory()).map(file => file.name);
		const json = JSON.stringify({
			message: "No app associated with this url",
			availableApps
		});
		fs.writeFile(path.join(buildDir, 'folderNames.json'), json, (err) => {
			if (err) {
				console.error(err);
				res.status(500).send('Internal Server Error');
				return;
			}
			// res.send('JSON file created successfully!');
			console.log('JSON file created successfully!');
			res.sendFile(path.join(__dirname, 'build', 'doesNotExists.html'));
		});
	});
});

app.listen(port, hostname, () => {
	console.log(`Server running on port: http://${hostname}:${port}/`)
});
