title: Bruce Banner: A Bookmarklet
date: Sat Jul 05 2014 19:18:05 GMT+0000 (UTC)

[Film Crit Hulk](http://badassdigest.com/author/67) has a lot of great work, but the uppercase letters wear on me.

I made this bookmarklet to convert his posts to sentence case.

1. Drag this link to your bookmark bar: <a href="javascript:(function() {
	Array.prototype.slice.call(document.querySelector('div.entry').children).forEach(function(element) {
		element.textContent = element.textContent.toLocaleLowerCase().replace(/([.!?]|^)(\s*\w)/gm, function(match, sentenceEnder, firstCharacter) {
			return sentenceEnder + firstCharacter.toLocaleUpperCase()
		})
	})
}())">Bruce Banner</a>
2. Visit one of his posts ([like this awesome one](http://badassdigest.com/2013/10/03/film-crit-hulk-smash-alcohol-withnail-and-gary-king/))
3. Click the bookmarklet
