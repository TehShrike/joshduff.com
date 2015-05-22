title: Why your webapp needs a state-based router
date: Thu May 21 2015 20:04:29 GMT-0500 (CDT)

Yeah, the title is slightly hyperbolic - not every webapp is appropriate for a state router.  Yours probably is, though!

## Quick intro

Some quick context before diving in to avoid possible misunderstandings:

- webapp: a single-page app running in the browser.  Uses pushstate instead of having the browser load new html pages.
- router: watches for url changes, and when they happen, calls a function of yours to let you know that you should update the content in the dom.

## Routing in a single-page webapp

Basic routers work something like this:

	route('/content/:name', function(params) {
		var name = params.name
		getContent(name, function(err, content) {
			$('.container').text(content)
		})
	})

Which is all well and good.  My web site, the one you're probably reading this post on, uses a router like that, and the routes aren't much more complicated than that.

But when you start writing a more complex webapp, you will discover new desires within yourself.  Your heart will begin to yearn for the ability to nest different parts of your webapp in a hierarchy.

<img src="http://joshduff.com/content/images/github-settings-submenu.png" alt="Github user settings" style="width: 360px; height: 162px;"/>

If your account page has a sub-menu that lets you switch between "profile" and "account settings" forms, you have a few options:

1. don't reflect the current sub-menu in the url - if they refresh the page at `/app/settings`, they see whatever the default/first submenu is.  This is bad because you can't hit the back button to go back to the last form, or send people links to the billing address form.
2. represent the sub-menu in the url instead of the page inside of it - you handle both the routes `/app/settings-profile` and `/app/settings-account`, and they both just happen to render that same menu on the left side.  This is bad because you have to re-render the menu every time, and you can't link to the settings page without having to link to one of its sub-pages.
3. Use a solution that lets you nest your views, and handles interpreting the url to realize that `/app/settings/profile` should display the main logged-in app view, with the settings page inside of that, and the profile sub-page inside of that.  This is the good option!

## In the bad 'ol days

I use AngularJS [at work](http://www.edatasource.com/), on a project that began in mid-2013.  Like every other Angular app at the time, we used [$location](https://docs.angularjs.org/api/ng/service/$location), the router exposed by the framework.

We had one route for the login screen, and another for each of the two different screens inside the app.  There was a lot of shared ui around the edges of the app, with the menu and search bar and everything, so both of those screen's routes used the same template, something like this:

	<div id="main">
		<div id="search-bar">
			<input type="text" magical-autocomplete>
		</div>
		<div id="menu">
			<ul>
				<li><a href="#/app/page1">Page 1</a></li>
				<li><a href="#/app/page2">Page 2</a></li>
			</ul>
		</div>
		<div id="content">
			<div ng-include="template.urlOfActualTemplate"></div>
		</div>
	</div>

So each of the two screens would set `scope.template.urlOfActualTemplate = 'this-screen/screen-template.html' and that would get dropped into the content.

Pretty ugly.  And forget about easily nesting any sub-views in either of those screens - everything that we wanted serialized to the url was manually synchronized to a querystring parameter, and we didn't ever go to the work of adding manual handling along the lines of `&childScreen=profile`.

## And then I found the light

When time came to begin the next AngularJS project for work, I turned to the barely-maintained-but-still-useful [ngbp](https://github.com/ngbp/ngbp) Angular boilerplate.  It came with a reasonable grunt build script (and oh man did I not want to have to write that again myself), but it also included [ui-router](https://github.com/angular-ui/ui-router).

ui-router is the kind of solution that makes everything clear once you start using it.  It lets you

- nest views or "states" inside of each other
- optionally associate urls with states so that changing the url can change any number of currently displayed states
- indicate which states care about which parameters in the url

So that you can write each state as its own little module - you don't have to watch for url changes in the querystring, because if a relevant parameter changes, your state goes away and a new version of the state is instantiated.  You don't have to care about the url routing for any of the states above or below you.

<img src="http://joshduff.com/content/images/analyst-menu-hierarchy.png" alt="Analyst Nextgen menu hierarchy" style="width: 467px; height: 187px;"/>

Each of those three menus is a different nested state that allows you to drill down to a different child state.  And the url routing is a dream!

## but... Angular

As a JavaScript developer, I am a child of the node/npm revolution, so I'm pretty framework-averse.  Give me disconnected modules that solve problems, and let me compose them myself.

I'm especially averse to AngularJS 1.x, which forces so many bad decisions down your throat (a horrible module system with no difference between private and public APIs, tying everything to a $scope and using dirty-checking to identify changes, and an inscrutable testing API).

ui-router is a fantastic library, solving a common difficult problem, and solving it very well.  It's not worth using AngularJS just to be able to use ui-router, though.

The few other similar libraries I've found seem tied to other technologies - I'm thinking of [react-router](https://github.com/rackt/react-router) and [Ember's router](http://guides.emberjs.com/v1.10.0/routing/defining-your-routes/).

## So I made my own

I want to build business applications that run in the browser without tying myself to a specific framework, so I need a state router that isn't stuck to a specific rendering library.  Thus, [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

Built with help from [ArtskydJ](https://github.com/ArtskydJ), it is a state router heavily inspired by ui-router, meant to be used with whatever templating library you like.  At the time of this writing, renderers have been set up for [Ractive.JS](http://www.ractivejs.org/), [Riot](https://muut.com/riotjs/), and [virtual-dom](https://github.com/Matt-Esch/virtual-dom) - and it's not too difficult to [implement new ones](https://github.com/TehShrike/ractive-state-router/blob/master/render.js?ts=4#L23) for whatever your favorite template/dom manipulation library is.

The documentation is [in the readme on Github](https://github.com/TehShrike/abstract-state-router).  I don't have good introductory wiki pages like ui-router yet, though there is an [example todo app](http://tehshrike.github.io/state-router-example/) with each of the current renderer options.

## You should use it!

If you're making a single-page webapp that is more complex than a simple content site like this blog, you need a state-based router, and I'd like to help you use this one.

If you have a favorite template/dom manipulation library that you want to use, let me know and I'll help you write the renderer so that you can use it with abstract-state-router.

If you run into any difficulties using it, open an issue on Github and let me know what the difficulty was.

The module is out on npm for you to try - [check it out on Github](https://github.com/TehShrike/abstract-state-router)!
