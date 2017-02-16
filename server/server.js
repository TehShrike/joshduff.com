require(`babel-polyfill`)
require(`babel-register`)({
	plugins: [
		`transform-async-to-generator`,
	]
})

require('./index.js').listen(8989)
