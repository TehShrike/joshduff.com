const port = process.env.PORT
	? parseInt(process.env.PORT, 10)
	: 8989

require(`./index.js`)().listen(port)
