---
title: SIDEBAAAAAAR
date: 2017-02-16T15:37:34.176Z
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
