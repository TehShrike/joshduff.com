title: Logical errors in queries: DO NOT WANT
date: 2010-02-04T09:17:00-06:00
summary: How to avoid a common JOIN mistake

During my career developing database-driven software (teehee, I'm a professional) I've noted that the most horrific query errors are the logical ones - queries that parse correctly, and return reasonable-looking data, but make wrong assumptions about how different parts of the query relate to each other.

One particular error that I've seen time and time again (even from people who have been writing queries for a while) can occur when summarizing data from multiple tables that have a one-to-many relationship.

...In other words, it could occur in queries written for most database-driven software.

## Solution: fix the problem by writing about it!

I wrote [a page documenting](http://wikido.isoftdata.com/index.php/The_GROUPing_pitfall) the cause of the logical error, doing my best to warn people against letting it slip into their own code.

I attempted to write it so it would be easy to read, possibly even entertaining (a lofty goal for a manual on writing database queries, perhaps) - there is some colorful language and plenty of juvenile humor mixed with the tech-speak.

The doc itself is part of the wiki of the company where I work.  I don't write a ton of documentation for our developers or customers (certainly not as much as I should), but whenever I do, I get this awesome feeling of usefulness.  Oh, and pride.  Sometimes, I feel so proud, that I feel compelled to link other people (who have no relationship to my company) to what I wrote!  Ridiculous, I know.

Remember: if you write queries, it is your responsibility to guarantee that they return true and accurate data!
