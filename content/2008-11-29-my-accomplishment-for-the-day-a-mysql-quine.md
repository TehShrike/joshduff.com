title: My accomplishment for the day: a MySQL quine!
date: 2008-11-29T06:38:00-06:00

"[Quine](http://en.wikipedia.org/wiki/Quine_%28computing%29):" a program that outputs it's complete source code when run.

I was lounging around in the MySQL chat room on irc.freenode.net, and someone suggested that I try to write a MySQL quine - a database query that would return the text of the query itself.

After about half an hour of screwing around, I got it!  It may not be a fantastic achievement, but I feel pretty leet about writing my first quine in a database query language.

<pre lang="mysql">
SELECT REPLACE(@v:='SELECT REPLACE(@v:=\'2\',1+1,REPLACE(REPLACE(@v,\'\\\\\',\'\\\\\\\\\'),\'\\\'\',\'\\\\\\\'\'));',1+1,REPLACE(REPLACE(@v,'\\','\\\\'),'\'','\\\''));
</pre>

Only 167 characters.  Hah!
