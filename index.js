const noddityStaticServer = require('noddity-static-server')

const Koa = require('koa')
const Router = require('koa-router')
const compress = require('koa-compress')

const Butler = require('noddity-butler')
const level = require('level-mem')

const indexHtml = require('fs').readFileSync('./index.html', { encoding: 'utf8' })

const contentUrl = 'https://joshduffcom-content-rfaihzuhfm.now.sh/'

const app = new Koa()
const router = Router()

router.get('/wat', (context, next) => {
	context.body = 'AW YEAH'
})

app.use(router.routes())

app.use(noddityStaticServer({
	assetsUrl: contentUrl,
	nonMarkdownContentUrl: contentUrl,
	indexHtml,
	data: {
		title: 'Josh Duff',
		editLink: 'https://github.com/TehShrike/joshduff.com/edit/master/content/',
		logo: '/content/images/logo.svg',
		errorPage: '404.md',
		pathPrefix: '/',
		pagePathPrefix: 'post/',
	},
	butler: Butler(contentUrl, level('server'), {
		refreshEvery: 1000 * 60 * 5,
		parallelPostRequests: 10
	})
}).callback())

module.exports = app
