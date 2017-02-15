require(`babel-polyfill`)
require(`babel-register`)({
	plugins: [
		`transform-async-to-generator`,
	],
	ignore: function(path) {
		// false => transpile with babel
		const nodeModules = /\/node_modules\//.test(path)

		if (nodeModules) {
			return !/\/(noddity-static-server|noddity-lazy-static-render)\//.test(path)
		}

		return false
	}
})

require('./index.js').listen(8989)
