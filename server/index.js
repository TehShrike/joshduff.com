const polkadot = require(`polkadot`)
const middleware = require(`polkadot-middleware`)
const router = require(`polkadot-router`)

const fs = require(`fs`)
const path = require(`path`)

const relative = relativePath => path.join(__dirname, relativePath)

const HEADERS = {
	contentType: `Content-Type`,
	location: `Location`,
	cacheControl: `Cache-Control`,
}

const CONTENT_TYPES = {
	html: `text/html; charset=utf-8`,
	md: `text/html; charset=utf-8`,
	png: `image/png`,
	svg: `image/svg+xml`,
	jpg: `image/jpeg`,
	txt: `text/plain; charset=utf-8`,
	css: `text/css`,
	js: `application/javascript`,
	xml: `application/xml`,
	json: `application/json`,
	ico: `image/x-icon`,
	rss: `application/rss+xml`,
}

module.exports = () => middleware(
	polkadot,
	handleErrors,
	cacheControlHeaders,
	noFuckingAroundNow,
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
			'/*': figureOutFilePathAndThen(relative(`../public`), servePath),
		},
		HEAD: {
			ping: () => ``,
			'/323/:whatever?': permanentRedirect(`/2011-09-26-how-should-we-then-drive.md`),
			'/203/:whatever?': permanentRedirect(`/2010-06-21-profanities-and-other-funny-words.md`),
			'/200/:whatever?': permanentRedirect(`/2010-05-25-dirty-mother.md`),
			'/189/:whatever?': permanentRedirect(`/2010-02-19-run-a-query-for-every-table-in-a-database.md`),
			'/173/:whatever?': permanentRedirect(`/2010-02-04-logical-errors-in-queries-do-not-want.md`),
			'/156/:whatever?': permanentRedirect(`/2010-01-22-convert-blocks-of-text-to-sentence-case.md`),
			'/145/:whatever?': permanentRedirect(`/2010-01-15-running-my-first-campaign.md`),
			'/36/:whatever?': permanentRedirect(`/2008-11-29-my-accomplishment-for-the-day-a-mysql-quine.md`),
			'/': statusAndHeaderForFile(relative(`../public/index.md`)),
			'/*': figureOutFilePathAndThen(relative(`../public`), statusAndHeaderForFile),
		},
	}, (req, res) => {
		res.statusCode = 405
		res.setHeader(HEADERS.contentType, CONTENT_TYPES.txt)
		return `¯\\_(ツ)_/¯`
	})
)

const handleErrors = next => async(req, res) => {
	try {
		return await next(req, res)
	} catch (err) {
		res.statusCode = 500

		return err.message || err
	}
}

const MAX_AGE_SECONDS = 60 * 60
const cacheControlHeaders = next => async(req, res) => {
	const body = await next(req, res)

	res.setHeader(HEADERS.cacheControl, `public, max-age=` + MAX_AGE_SECONDS)

	return body
}

const noFuckingAroundNow = next => (req, res) => {
	if (req.path.split(`/`).some(chunk => chunk === `..`)) {
		console.log(`Detected some fucking around`)
		res.statusCode = 404
		return
	}

	return next(req, res)
}

const fileExists = path => new Promise((resolve, reject) => {
	fs.access(path, fs.constants.R_OK, err => {
		const readable = !err
		resolve(readable)
	})
})

const statusAndHeaderForFile = path => async(req, res) => {
	if (!await fileExists(path)) {
		res.statusCode = 404
		res.setHeader(HEADERS.contentType, CONTENT_TYPES.txt)
		return ``
	} else {
		const contentType = CONTENT_TYPES[getExtension(path)] || null

		contentType && res.setHeader(HEADERS.contentType, contentType)
	}
}

const servePath = path => async(req, res) => {
	await statusAndHeaderForFile(path)(req, res)

	if (res.statusCode === 404) {
		return `File not found`
	}

	return fs.createReadStream(path)
}

const figureOutFilePathAndThen = (root, fn) => (req, res) => {
	const requestPath = req.path
	const filePath = path.join(root, requestPath)

	return fn(filePath)(req, res)
}

const getExtension = inputPath => {
	const ext = path.extname(inputPath)

	return ext
		? ext.slice(1)
		: null
}

const permanentRedirect = redirectTo => async(req, res) => {
	res.statusCode = 301
	res.setHeader(HEADERS.location, redirectTo)
}
