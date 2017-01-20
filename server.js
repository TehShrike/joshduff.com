require(`babel-polyfill`)
require(`babel-register`)({
	plugins: [
		`transform-async-to-generator`,
	],
	ignore: function(path) {
		// false => transpile with babel
		const nodeModules = /\/node_modules\//.test(path)
		if (nodeModules) {
			if (/\/noddity-static-server\//.test(path)) {
				console.log('matching', path)
			}

			return !/\/noddity-static-server\//.test(path)
		}
		return false
	}
})

require('./index.js').listen(8989)
