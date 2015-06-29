title: Run a query for every table in a database
date: 2010-02-19T02:16:00-06:00
categories: mysql

Ever wished you could run a dangerous query like DROP TABLE or TRUNCATE against every table in a database in a single query?

No?

Well, how about something like CHECK or REPAIR table, then?

If you ever find yourself in the rare situation where you need to run the same query across every table in a database, this procedure might make your life easier:

```
DELIMITER $$
CREATE PROCEDURE `p_run_for_each_table`(IN strDatabase TEXT, IN strOperation TEXT)
    DETERMINISTIC
BEGIN
	DECLARE strQuery TEXT;
	DECLARE strTable VARCHAR(255);
	DECLARE bDone INT DEFAULT 0;
	DECLARE TableCursor CURSOR FOR
		SELECT `TABLE_NAME`
		FROM `information_schema`.`TABLES`
		WHERE `TABLE_SCHEMA` = strDatabase AND TABLE_TYPE = 'BASE TABLE';
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET bDone = 1;

	OPEN TableCursor;

	REPEAT
		FETCH TableCursor INTO strTable;

		SET @QueryThatWasPassedIn := REPLACE(
			REPLACE(strOperation, '{?database}', strDatabase)
			, '{?table}', strTable);

		PREPARE Statement FROM @QueryThatWasPassedIn;
		EXECUTE Statement;
	UNTIL bDone END REPEAT;

	CLOSE TableCursor;
	DEALLOCATE PREPARE Statement;
END$$
DELIMITER ;
```

# Useage

The procedure takes two parameters.  The first one is the name of the database whose tables you want to run the query for.

The second is the query you would like to run.  The strings "{?database}" and "{?table}" will be replaced with the database and table names.

```
CALL p_run_for_each_table('databasename', 'SELECT * FROM {?database}.{?table}');
```

# What queries you can run

You should be able to use any queries that can be run in a prepared statement - you can find the list about two-thirds of the way down [this page](http://dev.mysql.com/doc/refman/5.1/en/sql-syntax-prepared-statements.html).

As of MySQL 5.1, you can run these queries: "`ALTER TABLE`, `CALL`, `COMMIT`, `CREATE INDEX`, `CREATE TABLE`, `DELETE`, `DO`, `DROP INDEX`, `DROP TABLE`, `INSERT`, `RENAME TABLE`, `REPLACE`, `SELECT`, `SET`, `UPDATE`, and most `SHOW` statements."
