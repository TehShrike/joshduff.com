title: Side project post-partum: Communal Checklist
date: Tue Jul 28 2015 21:21:37 GMT-0500 (CDT)

Suddenly, a side project appears!

My wife was looking for a site to set up a gift registry.  She tried several sites, but none of them were great - Amazon and Target and them all have pretty good ones, but then people are locked into buying from that one location.

Other sites were more open-ended, but most of them required that people create accounts, and the one that seemed most reasonable forced you to re-create each item if you wanted people indicate that they were buying say, only one of the two containers of disposable wipes that you want.

My finely-tuned programmer senses were tingling.  A simple CRUD webapp, sort of a custom to-do list - I should be able to make a servicable version in a few evenings!  I'd call it the Communal Checklist.

A month later, after spending 30-90 minutes coding every few days, I finally got the 1.0 out.  Here's what I learned!

## My tools are getting better but I need to keep putting them first

My first bad decision was to not use the [abstract-state-router](https://github.com/TehShrike/abstract-state-router).  I really didn't think it would be necessary - the Communal Checklist is nearly a literal single-page application, with a home screen and one list editing/viewing screen.  A simple router like [hash-brown-router](https://github.com/TehShrike/hash-brown-router) should be plenty.

I forgot about the other niceities provided by the abstract-state-router - without it, I had to

1. load asynchronous data after the template has been displayed, and handle both the "loading data" and "data done loading" states
2. deal with (or in my case, convince myself I could ignore) cleaning up event listeners on route change instead of getting a nice clean `destroy` event if the state parameters changed
3. actually care about where the template would be inserted, and manually create the Ractive object at that DOM location (just the `<body>` element in this case, but still annoying)

Turns out the abstract-state-router isn't just handy for medium-to-large webapps, it's handy for the small ones.  I should have just used it instead of thinking that a smaller library with a slightly smaller API would have ended up making my app simpler.

## I should have used this as an excuse to keep working on my tools instead of just squeezing out an app

I've been experimenting with [reactive programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) and working on some tools to make easy to use in my user interfaces lately, but haven't actually used a reactive programming library in an app yet.

Communal Checklist was, in my mind, something I could have ready for my wife to use in a couple days.  No need to work in any tools I wasn't already familiar with, just make the app and move on.

It turns out, even for relatively simple apps, hooking together business logic from behind a view, even as sexy a view interface as [RactiveJS](http://www.ractivejs.org/), isn't that pretty.  If I had just handled user changes with reactive streaming library [Bacon.js](https://baconjs.github.io/), it may have felt slightly slower at first, but it would have ended up simpler.

In addition to not really slowing down development, using Bacon.js to hook up a real app would have given me practical experience in a library that I haven't given a good road test yet.

## uh... clarify specs first

I proudly showed my wife the beta a bit less than two weeks after I started.  She poked around a bit and then asked "how do I add categories?"

An entirely reasonable request, but I hadn't considered splitting list items up across categories.  This required some relatively small changes on the server-side to handle the changed data structure, but it took more work on the client-side.

I mean, I could have just added another level of nested loops to the template and doubled down on the number of functions in my single list.js file, but I was already pushing what I was willing to stand as far as code complexity.

This was the first time I'd made a real app with RactiveJS that didn't use the abstract-state-router, and I'd never had to figure out how to nest views properly in Ractive.

In AngularJS, I would have already created a new directive to represent single list items, and inserting categories would have just involved creating a new directive between the outer list template and the item template.

I discovered [components](http://docs.ractivejs.org/latest/components) to accomplish the same thing.

## Ordered arguments are evil srsly

I spent hours tracking down bugs caused by emitting lists of 5+ arguments to the socket.io listeners on the server side that weren't quite in the right order.

I switched to emitting objects with named properties and everything became simple again.

## Other things

- Bootswatch is still awesome
- my first real responsive design
- deployment is interesting: nginx and running my own servers on Digital Ocean
- will it scale: IndexedDB
