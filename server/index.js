const polkadot = require(`polkadot`)
const router = require(`polkadot-router`)

const fs = require(`fs`)
const path = require(`path`)

const relative = relativePath => path.join(__dirname, relativePath)

const contentTypes = {
	html: `text/html`,
	md: `text/html`,
	png: `image/png`,
	svg: `image/svg+xml`,
	jpg: `image/jpeg`,
	txt: `text/plain`,
	css: `text/css`,
	js: `application/javascript`,
	xml: `application/xml`,
	json: `application/json`,
	ico: `image/x-icon`,
	rss: `application/rss+xml`,
}

module.exports = () => polkadot(
	handleErrors(
		noFuckingAroundNow(
			router({
				GET: {
					ping: () => `pong`,
					'/323/:whatever?': permanentRedirect(`/2011-09-26-how-should-we-then-drive.md`),
					'/203/:whatever?': permanentRedirect(`/2010-06-21-profanities-and-other-funny-words.md`),
					'/200/:whatever?': permanentRedirect(`/2010-05-25-dirty-mother.md`),
					'/189/:whatever?': permanentRedirect(`/2010-02-19-run-a-query-for-every-table-in-a-database.md`),
					'/173/:whatever?': permanentRedirect(`/2010-02-04-logical-errors-in-queries-do-not-want.md`),
					'/156/:whatever?': permanentRedirect(`/2010-01-22-convert-blocks-of-text-to-sentence-case.md`),
					'/145/:whatever?': permanentRedirect(`/2010-01-15-running-my-first-campaign.md`),
					'/36/:whatever?': permanentRedirect(`/2008-11-29-my-accomplishment-for-the-day-a-mysql-quine.md`),
					'/': servePath(relative(`../public/index.md`)),
				},
			}, serve(relative(`../public`)))
		)
	)
)

const handleErrors = handler => async(req, res) => {
	try {
		return handler(req, res)
	} catch (err) {
		res.statusCode = 500

		return err.message || err
	}
}

const noFuckingAroundNow = handler => (req, res) => {
	if (req.path.split(`/`).some(chunk => chunk === `..`)) {
		console.log(`Detected some fucking around`)
		res.statusCode = 404
		return
	}

	return handler(req, res)
}

const fileExists = path => new Promise((resolve, reject) => {
	fs.access(path, fs.constants.R_OK, err => {
		const readable = !err
		resolve(readable)
	})
})

const servePath = path => async(req, res) => {
	console.log(`trying to serve`, path)
	if (!await fileExists(path)) {
		res.statusCode = 404
		return `File not found`
	}

	const contentType = contentTypes[getExtension(path)] || null

	contentType && res.setHeader(`Content-Type`, contentType)

	return fs.createReadStream(path)
}

const serve = root => async(req, res) => {
	const requestPath = req.path
	const filePath = path.join(root, requestPath)

	return servePath(filePath)(req, res)
}

const getExtension = inputPath => {
	const ext = path.extname(inputPath)

	return ext
		? ext.slice(1)
		: null
}

const permanentRedirect = redirectTo => async(req, res) => {
	res.statusCode = 301
	res.setHeader(`Location`, redirectTo)
}
