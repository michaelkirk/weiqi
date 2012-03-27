var settings = {
	'sessionSecret': 'sessionSecret'
	, 'port': 8000
	, 'uri': 'http://localhost:8000' // Without trailing /
	, 'debug': (process.env.NODE_ENV !== 'production')
};

if (process.env.NODE_ENV == 'production') {
	settings.uri = 'http://evening-meadow-5281.herokuapp.com/';
	settings.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT
}
module.exports = settings;
