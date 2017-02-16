const noddityStaticServer = require('noddity-static-server')
const makeLazyRenderer = require('noddity-lazy-static-render')

const Koa = require('koa')
const Router = require('koa-router')
const compress = require('koa-compress')
const conditionalGet = require('koa-conditional-get')

const Butler = require('noddity-butler')
const level = require('level-mem')

const indexHtml = require('fs').readFileSync(__dirname + '/index.html', { encoding: 'utf8' })

const contentUrl = 'https://joshduffcom-content-sbptaapaix.now.sh'
const assetsUrl = 'https://joshduffcom-assets-wrsoneocce.now.sh'

const butler = Butler(contentUrl, level('server'), {
	refreshEvery: 1000 * 60 * 5,
	parallelPostRequests: 10
})

const lazyRender = makeLazyRenderer({
	butler,
	data: {
		title: 'Josh Duff',
		editLink: 'https://github.com/TehShrike/joshduff.com/edit/master/content/',
		logo: '/images/logo.svg',
		errorPage: '404.md',
		pathPrefix: '/',
		pagePathPrefix: '',
	},
	indexHtml
})

const app = new Koa()
const router = createNoddityAppRouter({ butler, lazyRender })

app.use(conditionalGet())
app.use(compress())

app.use(router.routes(), router.allowedMethods())

module.exports = app

function createNoddityAppRouter({ butler, lazyRender }) {
	const staticServerRouter = noddityStaticServer({
		assetsUrl: assetsUrl,
		nonMarkdownContentUrl: contentUrl,
		assetExtensionsToServeFromContent: [ 'jpg', 'jpeg', 'gif', 'png', 'svg' ],
		butler,
		lazyRender
	})

	const router = Router()

	router.get('/wat', (context, next) => {
		context.body = 'AW YEAH'
	})

	router.use('', staticServerRouter.routes(), staticServerRouter.allowedMethods())

	return router
}
