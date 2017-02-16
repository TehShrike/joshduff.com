const path = require('path')
const fs = require('fs')

const noddityStaticServer = require('noddity-static-server')
const makeLazyRenderer = require('noddity-lazy-static-render')

const Koa = require('koa')
const Router = require('koa-router')
const compress = require('koa-compress')
const conditionalGet = require('koa-conditional-get')

const Butler = require('noddity-butler')
const level = require('level-mem')

const indexHtml = fs.readFileSync(path.join(__dirname, '/index.html'), { encoding: 'utf8' })
const keybaseTxt = fs.readFileSync(path.join(__dirname, '../.well-known/keybase.txt'), { encoding: 'utf8' })

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

	router.get('/342(/.+)?', permanentRedirect('/2012-11-29-an-entreaty.md'))
	router.get('/323(/.+)?', permanentRedirect('/2011-09-26-how-should-we-then-drive.md'))
	router.get('/270(/.+)?', permanentRedirect('/2011-05-10-why-you-should-not-be-using-mysqli-prepare.md'))
	router.get('/252(/.+)?', permanentRedirect('/2011-01-09-what-would-universities-do-if-they-cared-about-computer-science.md'))
	router.get('/248(/.+)?', permanentRedirect('/2010-08-23-on-growing-as-a-programmer-i-think.md'))
	router.get('/203(/.+)?', permanentRedirect('/2010-06-21-profanities-and-other-funny-words.md'))
	router.get('/200(/.+)?', permanentRedirect('/2010-05-25-dirty-mother.md'))
	router.get('/189(/.+)?', permanentRedirect('/2010-02-19-run-a-query-for-every-table-in-a-database.md'))
	router.get('/173(/.+)?', permanentRedirect('/2010-02-04-logical-errors-in-queries-do-not-want.md'))
	router.get('/156(/.+)?', permanentRedirect('/2010-01-22-convert-blocks-of-text-to-sentence-case.md'))
	router.get('/145(/.+)?', permanentRedirect('/2010-01-15-running-my-first-campaign.md'))
	router.get('/141(/.+)?', permanentRedirect('/2009-12-29-sleep-schedule.md'))
	router.get('/39(/.+)?', permanentRedirect('/2009-07-03-recent-big-news-cops-beat-up-gay-people.md'))
	router.get('/38(/.+)?', permanentRedirect('/2009-01-13-if-life-isnt-fair-should-we-make-laws-to-fix-it.md'))
	router.get('/36(/.+)?', permanentRedirect('/2008-11-29-my-accomplishment-for-the-day-a-mysql-quine.md'))
	router.get('/33(/.+)?', permanentRedirect('/2008-07-18-things-i-think-about-while-sitting-on-the-toilet.md'))
	router.get('/19(/.+)?', permanentRedirect('/2006-09-23-an-observation-on-college-classes.md'))

	router.get('/feed', permanentRedirect('//rss.noddityaas.com/?noddityRoot=http://joshduff.com/content/&postUrlRoot=http://joshduff.com/%23!/post/&title=Josh Duff .com&author=Josh'))

	router.get('/content/:contentPath(.*)', async context => {
		context.status = 301
		context.set('Location', path.join(contentUrl, context.params.contentPath))
	})

	router.get('/ping', async (context, next) => {
		context.body = 'pong'
		await next()
	})

	router.get('/.well-known/keybase.txt', async (context, next) => {
		context.body = keybaseTxt
		await next()
	})

	router.use('', staticServerRouter.routes(), staticServerRouter.allowedMethods())

	return router
}

function permanentRedirect(redirectTo) {
	return async function redirecter(context, next) {
		context.status = 301
		context.set('Location', redirectTo)
	}
}
