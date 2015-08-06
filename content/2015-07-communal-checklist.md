title: Side project post-partum: Communal Checklist
date: Tue Jul 28 2015 21:21:37 GMT-0500 (CDT)

Suddenly, a side project appears!

My wife was looking for a site to set up a gift registry.  She tried several sites, but none of them were great - Amazon and Target and other online stores have pretty good ones, but then our friends would be locked into buying from that one location.

Other registry sites are more open-ended, but most of them require that people create accounts, and one of the ones that seemed most reasonable forces you to create multiple rows for each item if you wante people to be able to indicate that they were buying say, only one of the two needed containers of disposable wipes.

My finely-tuned programmer senses tingled.  A simple CRUD webapp, something like a custom to-do list - I should be able to whip up a servicable app in a few evenings!  I'd call it the Communal Checklist.

Fast forward to now, about a month later.  After putting in 30-90 minutes coding every two or three days, I have finally deployed version 1.0.  Here's what I learned!

## My tools are getting better but I need to keep putting them first

My first bad decision was to not use the [abstract-state-router](https://github.com/TehShrike/abstract-state-router).  I didn't think it was necessary - the Communal Checklist is nearly a literal single-page application, with one home screen and one editing/viewing screen.  A simple router like [hash-brown-router](https://github.com/TehShrike/hash-brown-router) should be plenty.

I forgot about the other niceities provided by the abstract-state-router - without it, I had to

1. load asynchronous data after the template has been displayed, and handle both the "loading data" and "data done loading" states
2. deal with (or in my case, convince myself I could ignore) cleaning up event listeners on route change instead of getting a nice clean `destroy` event if the state parameters changed
3. actually care about where the template would be inserted, and manually create the Ractive object at that DOM location (just the `<body>` element in this case, but still annoying)

Turns out the abstract-state-router isn't just for medium-to-large webapps, it's handy for the small ones.  I should have used it instead of imagining that a smaller library with a slightly smaller API would make my app simpler.

## I should have used the project as an excuse to keep working on my tools

Communal Checklist was, in my mind, something I could have ready for my wife to use in a couple evenings.  No need to work in any tools I wasn't already familiar with, I planned to just make the app and move on.

Specifically, I opted to not use a [reactive programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) library when hooking up my user interface.  I've been experimenting with the reactive programming library [Bacon.js](https://baconjs.github.io/) lately and putting together some tools to make those libraries easier for me to use, but I haven't actually used a reactive programming library in an app yet.

It turns out, even for relatively simple apps, hooking together business logic from behind a view (even as sexy a view interface as [RactiveJS](http://www.ractivejs.org/)) isn't that pretty.  If I handled user changes with a reactive streaming library, I may have felt slightly slower at first, but the code would have ended up simpler.

In addition to not slowing down development in reality, using Bacon.js to hook up a real app would have given me practical experience that would have been valuable as I use it to hook together my next, much more complicated apps.

## also, uh... clarify specs first

I proudly showed my wife the beta slightly less than two weeks after I started.  She poked around a bit and then asked "how do I add categories?"

An entirely reasonable request, but I hadn't considered splitting lists up into categories.  Allowing items to be divided between different categories required relatively small changes on the server-side to handle the changed data structure, but it took a bit more work on the client-side.

### Which made the code slightly more complicated

In theory I could have just added another level of nested loops to the template and plowed forwards adding to the long list of functions in my single list.js file, but I had already pushed past what I was comfortable with as far as code complexity.

This was the first real app I'd made with RactiveJS without using the abstract-state-router, and I'd never had to figure out how to nest templates properly in Ractive.

In AngularJS, I would have already created a second directive to represent single list items, and adding category support would have just involved creating a new directive to layer between the outer list template and the item template.

The Ractive documentation some more revealed [components](http://docs.ractivejs.org/latest/components) to be the reasonable choice.  I broke out list items into their own template with their own associated code and created a new category template.

If I had been on the ball from the beginning I would have been using isolated scopes to make things simpler.

## Ordered arguments are evil srsly

I lost a couple hours tracking down bugs caused by emitting lists of 5+ arguments to the socket.io listeners on the server side.  I wasn't consistent on the argument order between all my functions, and I paid the price.

You'd think I would have learned by now!  Ordered arguments are evil, even when emitting values across socket.io.

I switched to emitting objects with named properties and everything became simple again.

## Sweet stylez

I used a [Bootswatch](http://bootswatch.com/) Bootstrap theme again.  Instant classy site design!  Biggest downside: it uses Google hosted fonts, making it impossible to work on the site without internet access to hit Google CDNs.

### Responsive

Another buzzword finally achieved!  I decided to actually put the effort into making the site look good at small sizes.  I'd used Bootstrap's grid layout from the beginning - it turns out that making it properly responsive just involved giving all my rows a column width at ever single size.  w00t!

## Storage: not a real database

I am quite attracted to the [LEBRON](http://lebron.technology/) stack.  I've used [LevelUP](https://github.com/Level/levelup) a good bit in the past, for Noddity and other projects - it's an excellent interface to a key-value store.  And from what I've heard, LevelDB is quite a good flat-file key-value store - it's the SQLite of key-value stores, and SQLite is awesome!

So, I took the plunge - I wrote and deployed a webapp using a [nosql](http://howfuckedismydatabase.com/nosql/) database.

It's a pretty defensible choice - I don't expect traffic to go out of control, and using LevelUP as my interface means I can relatively easily switch to other backends besides LevelDB.  The simple key-value store makes local testing easy, and deployments are as simple as `npm install`.

Yet, if I were starting today, this is another choice I would make differently.

Using a key-value store actually made my server-side code more complex than it needed to be.

In order to read and update a list category or a category's item with a single read, I have to store them all at the same key.

To update a list item, I have to look up the list by its id (my one lookup), iterate over the categories to find the one with the correct id, and then iterate over the category's items to find the id that is being updated.  I then copy the changed values over to the original document, and save the whole thing back in at the list's key.

I realize that more advanced document stores have more advanced tools for working with child documents, but most of the attraction of the key-value store for me is in LevelUP as an interface.

Maybe I should have stored lists, categories, and items at their own keys and suffered the extra lookups in exchange for simpler code.  Or maybe I should have just used a database that supported SQL.

Relational database are actually pretty sweet.

### Will it scale?

I have no idea!  I figure it will at least make it past the baby shower.

Honestly though, the benchmarks that LevelDB advertises are far beyond what I expect this app to ever have put against it, even in the unlikely event that the Communal Checklist turns into a bustling hub of gift registries.

## Passive income!

Communal Checklist represents my first attempt at generating passive income.  Every time someone adds a link to an Amazon item, my affiliate code is automatically attached.

If my site does ever start getting regular traffic, this may lead to some small regular income, as Amazon is a monster of internet shopping (though I understand that when it comes to first-party gift registries, Target still provides a better experience at the moment).

## Yet to do

The most obvious missing feature that I know if is the inability to reorder items.  If many people start using the site, I'll give [dragula](https://github.com/bevacqua/dragula) another try (I couldn't figure out how to get the dragging styles to work in my first quick try).

Other assorted TLC would include testing the app more thoroughly on phones and touchscreens, and figuring out how to make the checkboxes larger and friendlier.

In the short term, I plan to slim down the CSS and inline the webfonts to increase the loading speed.  I also need to build gzipped versions of static content on `npm run build`.

The short term fixes will probably happen in spare time over the next week, but the other things probably won't happen unless the site sees regular traffic going forward.  Speaking of which, I suppose I need to set up some kind of analytics, too.  Does anyone know of a reasonable analytics site that Google Analytics?

## In conclusion

Like everything else I make, the code to Communal Checklist is [public on Github](https://github.com/TehShrike/communal-checklist) and is licensed [WTFPL](http://wtfpl2.com/).

If you want a lightweight gift-registry/checklist collaboration app that doesn't require you to sign in, go to [communalchecklist.com](http://communalchecklist.com/)!
