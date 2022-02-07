---
title: Writing SQL for applications
date: 2016-07-26T01:11:19.617Z
---

For about the last decade I've been writing business software backed by relational databases.  Working with my teammates, I have acquired conventions for writing schema and production queries that make interacting with the database simpler and easier.

These conventions primarily optimize for **reading or writing queries in production code**.

I believe it is fair to say that for most business applications, the schema + data *is* the application, with the rest of the code there to make the application easy to work with.

As Patrick McKenzie likes to remind us, most of our industry is built on building specialized spreadsheets.

> Every spreadsheet shared in a business is an angel announcing another SaaS app still needs to be built.
>
> – @patio11 [2015-10-18](https://twitter.com/patio11/status/655674551615942657)

The less friction involved in interacting with the underlying data, the greater our ability to develop our application.

# Schema design conventions

Most of the conventions in schema design enable two things:

First, the ability to write queries without having to look up a bunch of table schemas to remind yourself what the column names are, or spelling idiosyncrasies.

Second, looking at a single table and quickly understanding all of its relationships.

## The primary key column should be either `id`, or the table name suffixed with `_id`

It's a matter of preference whether you use `customer_id` versus `id` as the primary key column of the `customer` table, you could make arguments either direction - just apply the convention consistently.

The actual suffix/name doesn't matter, but `_id` seems to be the most common convention.

The main point is that whatever suffix you pick should be consistent across the entire schema.  This lets you join to another table without having to remember anything but the table name.

## Foreign keys should always contain the name of the table they link to

If rows in your `invoice` table link to rows in your `customer` table, the invoice table should be named `customer_id`, not `buyer_id` or `purchaser_id`.

This convention lets you know what the foreign keys of a table are referencing just by looking at the output from `DESCRIBE tablename`, which makes writing queries easier.  It also makes queries in code easier to follow.

Sometimes the name of the column by itself isn't enough - for example, besides the purchasing customer, your invoice might have a `referrer_customer_id`.  As long as the column ends with the `[tablename]_id` for the table you're linking to, everything is good and easy to read.  Naming that column `referrer_id` makes your schema much more difficult to read and requires you to memorize a bunch of special-case names.

## All tables have a single-column auto-increment primary key

This is something I waffled on a lot in my early years.  After all, isn't the primary key just an arbitrarily chosen candidate key?  Why not use a "natural" key, if one exists?

If you're using MySQL + InnoDB, there are real performance benefits to using an auto-increment primary key, but even if that were not the case I have become convinced that natural keys should not be used as the primary key.

No matter how sure you are that a natural candidate key will never change, and that all the values in the key are immutable after being inserted, it is very likely that at some point, business concerns will require that some of the values be changed, breaking all foreign key references and caches throughout your system.

That fear alone is pretty motivating.  But beyond that I have found that when foreign keys use identifiers that don't have any business concern outside of the database, queries are easier to write and mutating state in tables becomes less scary.

## No abbreviations in table or column names

Abbreviations and otherwise shortened labels make your schema difficult to read, and incomprehensible to people who don't spend every minute in the project.  Saving those occasional keystrokes is not worth it.

Making an exception for industry-standard abbreviations is fine - in the car parts inventory industry, `vin` is a reasonable column name, and `esp` is an acceptable table name in the email marketing industry.

Using abbreviations that you come up with yourself, or drpping vwls to sv chars is counterproductive.

## No plural table names

This is one of the simplest conventions, but the one that causes the most annoyance when ignored.

If your schema has a mix of pluralized and non-pluralized table names, you will forever be referring to your list of table names to remember if you should be typing `customer` or `customers`.

Half the time I see someone with a plural table name, they leave the `s` off of some or all of the key references - does the invoice table contain a `customer_id` column, or a `customers_id` column?  I dunno, better go look.

Just remember that the table name should be representative of what a single row contains.  A row in the `invoice` table contains an `invoice`, not `invoices`.

This will allow you to write queries with many joins without having to look up a bunch of column/table names.

# Query conventions

These conventions all have the goal of making queries in production code easier to read and maintain.

## No `SELECT *`

Perhaps the most [commonly-known SQL antipattern](http://www.parseerror.com/blog/select-*-is-evil).

Queries should specify exactly the columns that you require.  There are performance implications, but beyond that, your queries should be explicit about what they are doing, for the reader's benefit.

## No aliases

I see lots of developers aliasing table names in production queries.

```
SELECT i.total
FROM invoice AS i
WHERE i.customer_id = ?
```

This reduces the number of characters you type at the expense of taking more work to read the query when someone comes across it in the code later.  Don't make that tradeoff!

Developers shouldn't have to pull in a bunch of specialized naming context to be able to understand a query.  You want to be able to read over any part of the query and understand what columns are being used without having to read over the from and join clauses to memorize any aliases.

There's an obvious exception for when you need to reference the same table twice in different from/join clauses.  When writing production queries, you should still try to make the alias meaningful!

```
FROM invoice
JOIN invoice AS other_invoices_from_same_customer ON other_invoices_from_same_customer.customer_id = invoice.customer_id
	AND other_invoices_from_same_customer.invoice_id != invoice.invoice_id
```

## Always use table identifiers in multi-table queries

Similarly, if you consistently use table names in column identifiers, you make it easier to read over your query in smaller chunks.  `SELECT customer_id` is less meaningful than `SELECT invoice.customer_id`.

This convention does make it easier to add joins to existing queries.  However, in my mind the primary advantage is the improved readability.

## Uppercase everything except identifiers

Sadly, I haven't yet worked with a code editor that applied SQL syntax highlighting inside of static strings.

Uppercasing the non-identifier parts of the SQL (e.g. `FROM invoice` instead of `from invoice`) makes queries embedded in code easier to read.

## Newlines before each query clause

A query is composed of an ordered list of components called "clauses".  Queries are easier to read when the clauses are separated by newlines.

```
SELECT SUM(invoice.total)
FROM customer
JOIN invoice ON invoice.invoice_id = customer.customer_id
	AND invoice.finalized = TRUE
WHERE customer.customer_id = ?
```

As opposed to

```
SELECT SUM(invoice.total) FROM customer JOIN invoice ON invoice.invoice_id = customer.customer_id AND invoice.finalized = TRUE
WHERE customer.customer_id = ?
```

You and your team can come up with your own conventions around the rest of the whitespace, but I think newlines before each clause are a must for readability.

# Personal context

I've worked on evolving schemas with hundreds of tables.  Following these conventions has made life demonstrably better.  Frustration is decreased, less time is wasted.

I have spent countless nights helping people with schema and query issues in [#mysql](http://hashmysql.org/) on Freenode, and the [MySQL room on StackOverflow](http://chat.stackoverflow.com/rooms/592/mysql-and-relational-databases).  Most developers do not appear to follow strong conventions like these.

At ISoft, in the early days of [ITrack Enterprise](http://wikido.isoftdata.com/index.php/ITrack/Enterprise), we were able to take a week and refactor the hodge-podge of tables (probably 80 at the time), bringing them in line with the conventions we had set up at the time, and updating the code to match.

This paid off enormously over the years as the application was deployed to many customers and the schema grew to ~200 tables.  Not many applications get that chance, though - you have to evolve your schema while continuing to deliver features and fixes.

It's not hopeless - you can achieve an easy-to-work-with schema - as long as your team is on board, you leave things better than you found them when working in an area of the schema.

This is something I'm still working on!  I got super-excited to learn more after listening to Neal Ford's *Continuous Delivery: Infrastructure and Data* talk at Uberconf, and am following his recommendation to read [Refactoring Databases: Evolutionary Database Design](https://www.amazon.com/gp/product/0321774515/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321774515&linkCode=as2&tag=josduf-20&linkId=5983034458d49f14545009fbc8d5b31f).

# In conclusion

Your application is defined by its schema and the queries you use to interact with it.  Embrace it!  Keep it simple!  It will pay off.
