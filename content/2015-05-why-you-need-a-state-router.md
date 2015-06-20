title: Why your webapp needs a state-based router
date: Thu May 21 2015 20:04:29 GMT-0500 (CDT)

Yeah, the title is slightly hyperbolic - not every webapp is appropriate for a state router.  Yours probably is, though!

## Quick intro

Some quick context before diving in to avoid possible misunderstandings:

- webapp: a single-page app running in the browser that uses pushstate to control navigation instead of sending the browser to a different html page.
- router: when the url changes, triggers a function of yours so you can update the content in the dom.

## Routing in a single-page webapp

Simple routers work something like this:

	route('/content/:name', function(params) {
		var name = params.name
		getContent(name, function(err, content) {
			$('.container').text(content) // insert your DOM manipulation framework here
		})
	})

...which is all well and good.  My personal web site, the one you're probably reading this post on, uses such a simple router.

But when you start writing a more complex webapp, you will discover new desires within yourself.  You will begin to desire the ability to nest different parts of your webapp inside each other in some kind of hierarchy.

<img src="http://joshduff.com/content/images/github-settings-submenu.png" alt="Github user settings screenshot" style="width: 360px; height: 162px;"/>

Let's say you're making an account page that looks something like Github's here.

If your account page has a sub-menu that lets you switch between "profile" and "account settings" forms, you have a few options:

1. Neglect to put the current sub-menu's path in the url at all - if the user is at `/app/settings`, has the profile submenu open, and hits the refresh button, they pop back to whatever the default state is (maybe the profile page).  This is bad because they can't then hit the back button to go back to the last form, or send people links to a specific sub-menu on the settings page.
2. Represent the sub-menu in the url, instead of the page that contains it - you create routing rules for both `/app/settings-profile` and `/app/settings-account`, and both their templates just happen to contain that same menu on the left side.  This is bad because you have to re-render the menu every time, and you can't link to the settings page without having to link to one of its sub-pages.
3. Make the sub-menu a parameter of the settings route - so with a routing rule for `/app/settings/:submenu`, you put a big if block in your template that says "if the submenu parameter is 'settings' then embed that page, else if it's 'profile' embed that page..." etc etc.  This is awkward, and doesn't scale well past one level of nesting.
4. Use a solution that lets you nest your views, and handles interpreting the url to realize that `/app/settings/profile` should display the main logged-in app view, with the settings page inside of that, and the profile sub-page inside of that.  **This is the good option!**

## In the bad 'ol days

I first used AngularJS [at work](http://www.edatasource.com/) on a project that began in mid-2013.  Like every other Angular app at the time, we used the simple [$location](https://docs.angularjs.org/api/ng/service/$location) router exposed by the framework.

We had one route for the login screen, and another for each of the two different screens inside the app.  There was a lot of shared ui around the edges of the app, with the menu and search bar and everything, so both of those screen's routes used the same template, something like this:

	<div id="main">
		<div id="search-bar">
			<input type="text" magical-autocomplete>
		</div>
		<div id="menu">
			<ul>
				<li><a href="" ng-click="navigateTo('page1')">Page 1</a></li>
				<li><a href="" ng-click="navigateTo('page2')">Page 2</a></li>
			</ul>
		</div>
		<div id="content">
			<div ng-include="template.urlOfActualTemplate"></div>
		</div>
	</div>

Navigating to Page 1 or Page 2 would set `scope.template.urlOfActualTemplate = 'this-screen/screen-template.html'` and that would get displayed via the `ng-include`.

Pretty ugly.  Everything that we wanted serialized to the url was manually synchronized to a querystring parameter.  We never even considered going to the effort of representing further nested states by adding something like `&childScreen=profile` to the querystring.

## And then I fell into the light

When time came to begin the next AngularJS project for work, I turned to the barely-maintained-but-still-useful [ngbp](https://github.com/ngbp/ngbp) Angular boilerplate.  One of the modules it included out of the box was [ui-router](https://github.com/angular-ui/ui-router).

ui-router is one of those solutions where once you've seen it in use, you can feel certain programming problems clearing up right in front of you.  ui-router lets you:

- nest views or "states" inside of each other
- optionally associate url routes with states so that changing the url changes any number of currently displayed states
- indicate which states are associated with which parameters in the url

Allowing you to write each state as its own little module - you don't have to manually watch for changes to the querystring, because if any relevant parameter changes, your state goes away and a fresh new version of the state is instantiated.  Each state is its own little island and changes on navigation independently of any parent/child states.

<img src="http://joshduff.com/content/images/analyst-menu-hierarchy.png" alt="Analyst Nextgen menu hierarchy" style="width: 467px; height: 187px;"/>

This screenshot is from my employer's product.  Each of those three menus is a different nested state that allows you to drill down to a different child state.  And the url routing is a dream!

## but... Angular

I'm a child of the node/npm revolution, and as such I'm pretty framework-averse.  I prefer disconnected modules that solve problems that I can compose myself.

I'm especially averse to AngularJS 1.x, as it forces so many bad decisions down your throat (a horrible module system with no difference between private and public APIs, tying everything to a $scope and using dirty-checking to detect changes, and an inscrutable testing API).

ui-router is a fantastic library, solving a commonplace yet difficult problem, and solving it very well.  However, it's not worth using AngularJS just to be able to use ui-router.

I looked for similar libraries, but the only ones I found ([react-router](https://github.com/rackt/react-router) and [Ember's router](http://guides.emberjs.com/v1.10.0/routing/defining-your-routes/)) are similarly tied to their chosen rendering/templating tools.

## So I made my own

I want to build business applications that run in the browser without tying myself to a specific framework.  I need a state router that isn't tied to a specific rendering library.  Thus, [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

Built with help from [ArtskydJ](https://github.com/ArtskydJ), it is a state router heavily inspired by ui-router, meant to be used with whatever templating library you like.  At the time of this writing, renderers have been set up for [Ractive.JS](http://www.ractivejs.org/), [Riot](https://muut.com/riotjs/), and [virtual-dom](https://github.com/Matt-Esch/virtual-dom) - and it's not too difficult to [implement new ones](https://github.com/TehShrike/ractive-state-router/blob/master/render.js?ts=4#L23) with your favorite template/dom manipulation library.

The documentation is [on Github](https://github.com/TehShrike/abstract-state-router).  I don't have good introductory wiki pages like ui-router's yet, though there is an [example todo app](http://tehshrike.github.io/state-router-example/) using each of the current rendering/templating options.

## You should use it!

If you're making a single-page webapp that is more complex than a simple content site like this blog, you need a state-based router, and I'd like to help you use this one.

If you have a favorite template/dom manipulation library that you want to use, let me know and I'll help you write the renderer so that you can use it with abstract-state-router.

If you run into any difficulties using it, open an issue on Github or ping me on Twitter and let me know what the difficulty was.

The module is out on npm for you to try - [check it out on Github](https://github.com/TehShrike/abstract-state-router)!
