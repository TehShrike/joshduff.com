const http = require('http')
const ecstatic = require('ecstatic')

http.createServer(ecstatic({
	root: __dirname + '/content'
})).listen(9999)

http.createServer(ecstatic({
	root: __dirname + '/assets'
})).listen(9998)
