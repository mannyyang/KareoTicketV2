var config = {};

//General Configurations
config.webPort = process.env.PORT || 3000;

// Podio Credentials
config.podio = {
	clientID: 'kareo-web-requests',
	clientSecret: '6OuewbxOB8ZC2WewZYD4RpTQfR9xUeCLFrnXukcHMhTjvjTwF6R4fnP8v8WmXupN',
	username: 'marketing@kareo.com',
	password: 'kareo123',
	authResult: {},
	token: '',
	webProjectID: 8527312,
	milestoneID: 7805685
};

module.exports = config;
