title: Why you should NOT be using mysqli::prepare
date: 2011-05-10T10:33:00-06:00
categories: mysql, php

If you're writing PHP code that works with a MySQL database, there's a good chance you'll have heard about the spiffy "prepared queries" functionality available with the mysqli library.  "It's totally awesome!" some people will say - it makes queries easier to read in code, it handles all of the escaping for you (yay for easy security!), and it's way more efficient if you're running the same query a bunch of times.

Here's an example of how you might use the [prepared query functionality in PHP](http://us.php.net/manual/en/mysqli.prepare.php) (straight from the docs!):

	if ($stmt = $mysqli->prepare("SELECT District FROM City WHERE Name=?"))
	{
		$stmt->bind_param("s", $city);
		$stmt->execute();

		$stmt->bind_result($district);
		$stmt->fetch();

		printf("%s is in district %s\n", $city, $district);

		$stmt->close();
	}

It's a pretty reasonable-looking way of building a query.  Here's how you would have to build that query normally:

	$mysqli->query("SELECT District FROM City WHERE Name='"
		. $mysqli->real_escape_string($city) . "'");

Once you want to start using a lot of random static strings in your query, it can get pretty messy - having to concatenate all of those strings together, calling that escape function everywhere - using the bind_param function makes things a lot more readable.

## IF YOU'RE AN IDIOT!

No wait, hear me out, I didn't mean it like that - what I meant to say is, the prepared query syntax is probably doing more work than you expect it to.

See, prepared statements are actually a SQL thing, not something that the PHP devs added to the mysqli wrapper just because they thought it would be cool.  You can use prepared statements from the MySQL command line, too:

	PREPARE my_statement FROM 'SELECT District FROM City WHERE Name=?';
	SET @city := 'Amersfoort';
	EXECUTE my_statement USING @city;
	DEALLOCATE PREPARE my_statement;

mysqli::prepare is just giving you access to this nifty feature, which is fine and dandy.  However, you may have noticed something -

## That's a lot of queries to run, just to run a single SELECT query!

Now, if you're going to be running a ton of INSERT or UPDATE queries, and you just want to swap the variables out each time, you're fine - letting MySQL hang on to the meat of a query you're going to be running a hundred times is downright reasonable.

BUT - if all you're doing is running a half dozen queries while you're building a web page to display to the user, **the only thing you're doing is increasing the number of times you have to contact the server.**

How many superfluous database-contacts will there be?  As far as I can tell, you'll be contacting the server three times more than you need to:

*   Once to prepare the statement
*   Once to send the parameters to the server and get the results back
*   Once to deallocate the statement

_(I haven't looked at the source code, but I'm guessing that [commenter Angus M is correct in his assessment](http://dev.mysql.com/doc/refman/5.5/en/mysql-stmt-bind-param.html) that binding a parameter does not cause communication with the database.)_

If your database server is running on the same host as your web server, the cost of contacting the database is probably pretty low.  Still, after years of developing thinnish-desktop clients, my instinct is to avoid that overhead wherever possible.

## Stuck between a rock and an inefficient place

I imagine that, among the people who took those last few paragraphs seriously, there are two camps - the coders who will say "well, whatever" and keep writing queries using the prepare syntax because it's more convenient and easier to read (which is an argument I can understand), and the efficiency advocates who will give a tortured sigh and go back to writing queries with lots of awkward concatenation, in order to avoid overhead.

Or you could write/copy some simple query-building tools that do the stuff that you originally thought mysqli::prepare was doing!

Here's a function I threw together last night, which I imagine would suit the needs of many developers using PHP/MySQL:

	<?php

	function GetQueryWithData()
	{
		$Query = "";
		$ParameterNumber = 0;

		if (func_num_args() && $Query = func_get_arg($ParameterNumber++))
		{
			while ($ParameterNumber < func_num_args())
			{
				$NextParameter = func_get_arg($ParameterNumber++);
				$PlaceToInsertParameter = strpos($Query, '?');
				if ($PlaceToInsertParameter !== false)
				{
					$QuerySafeString = '';

					if (is_bool($NextParameter))
					{
						$QuerySafeString = $NextParameter ? 'TRUE' : 'FALSE';
					}
					else if (is_float($NextParameter) || is_int($NextParameter))
					{
						$QuerySafeString = $NextParameter;
					}
					else if (is_null($NextParameter))
					{
						$QuerySafeString = 'NULL';
					}
					else
					{
						$QuerySafeString = "'" . mysql_escape_string($NextParameter) . "'";
					}

					$Query = substr_replace($Query, $QuerySafeString, $PlaceToInsertParameter, 1);
				}
			}
		}

		return $Query;
	}

	print GetQueryWithData("SELECT * FROM `ass` WHERE `butt` = ? AND `cheek_id` = ? AND ? "
		. "AND `nullable_field` IS ? ",
		"lol 'WUT'", 13, true, null) . "\n";
	/* SELECT * FROM `ass` WHERE `butt` = 'lol \'WUT\'' AND `cheek_id` = 13 AND TRUE
		AND `nullable_field` IS NULL */

	print GetQueryWithData('UPDATE `some_table` SET `some_column` = ?, `some_other_column` = ?, '
		. '`some_id` = ? WHERE `yourface` = ?', '20',
		21, 69, 'sucks') . "\n";
	/* UPDATE `some_table` SET `some_column` = '20', `some_other_column` = 21,
		`some_id` = 69 WHERE `yourface` = 'sucks' */
	?>

The above function is a simple way to build a query with any number of parameters.  Strings will be escaped, numbers will not be quoted, and the function never contacts the database server.

Using this function, you can redux the query from the original example while only contacting the database once:

	$mysqli->query(GetQueryWithData("SELECT District FROM City WHERE Name=?", $city));

If you don't want to use that function, or roll your own query-builder, you can keep using mysqli's wrapper for prepared statements - just know that it was made for a different purpose, and it comes with a bit more cost.

## Edit: PDO!

After some discussion with [ss23](http://php.ss23.geek.nz/) in #mysql, I thought I'd better add some comments about [the PDO class](http://php.net/pdo).

On the surface (and according to much of the documentation), it appears to be a more generic (not just MySQL-specific) database wrapper with similar prepared-statement support.  However, it turns out that by default, [it only fakes prepared statements](http://bugs.php.net/bug.php?id=54638)!

So, it is possible to use PDO to write queries using a bind-parameter syntax that can make your code a lot easier to read, and simultaneously avoid contacting the database too often.  However, if that is how you decide to roll, I would recommend turning on fake-prepared-statements mode explicitly, just in case that default gets changed in the future:

	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
