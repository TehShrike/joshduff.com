---
title: SIDEBAAAAAAR
---

<a href="{{pathPrefix}}">
	<img class="logo" src="{{logo}}" />
</a>

<div>
	<h3>Posts</h3>
	<ol>
		{{#postList}}
			<li><a href="{{pathPrefix}}{{pagePathPrefix}}{{filename}}">{{title}}</a></li>
		{{/postList}}
	</ol>
</div>
