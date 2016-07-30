title: Convert blocks of text to sentence case in MySQL
date: 2010-01-22T07:31:00-06:00
categories: mysql

You know what I hate?  Paragraphs of capital (or all lowercase) letters.

The other day a coworker was looking to beautify a large quantity of data spread across some MySQL tables.  I created this function to make his life easier:

```
DELIMITER $$
CREATE FUNCTION `f_sentence_case`(strInput TEXT, nMinimumLength INT) RETURNS TEXT
DETERMINISTIC
BEGIN

	DECLARE result TEXT;
	DECLARE LastSpace INT;
	DECLARE NextSpace INT;
	DECLARE NextSlash INT;
	DECLARE Word TEXT;
	DECLARE NewSentence INT;
	DECLARE PreviousCharacter CHAR(1);
	DECLARE TrimmedWord TEXT;
	DECLARE NumberOfSpaces INT;
	DECLARE Swap INT;

	SET strInput := CONCAT(strInput, ' ');
	SET result := '';
	SET LastSpace := 1;
	SET NextSpace := LOCATE(' ', strInput, LastSpace + 1);
	SET NextSlash := LOCATE('/', strInput, LastSpace + 1);

	SET NextSpace := IF(LEAST(NextSlash, NextSpace) = 0, GREATEST(NextSlash, NextSpace), LEAST(NextSlash, NextSpace));

	label1: WHILE NextSpace DO

		SET Word := SUBSTR(strInput, LastSpace, NextSpace - LastSpace);
		SET PreviousCharacter := SUBSTR(strInput, LastSpace - 1, 1);
		SET NewSentence := LastSpace = 1 OR (NewSentence AND PreviousCharacter = ' ') OR PreviousCharacter IN('.', '!', '?');

		SET TrimmedWord := LTRIM(Word);
		SET NumberOfSpaces := LENGTH(Word) - LENGTH(TrimmedWord);
		SET Word := TrimmedWord;

		# Make it lowercase if it is all uppercase
		SET Word := IF(LENGTH(Word) >= nMinimumLength AND Word NOT REGEXP '[0-9]', 
			IF(NewSentence,
				CONCAT(UCASE(SUBSTR(Word, 1, 1)), LCASE(SUBSTR(Word, 2, LENGTH(Word) - 1))),
				LCASE(Word)
			), 
			Word);

		SET result := CONCAT(result, REPEAT(' ', NumberOfSpaces), Word);

		SET Swap := LastSpace;
		SET LastSpace := NextSpace;
		SET NextSpace := LOCATE(' ', strInput, Swap + 1);
		SET NextSlash := LOCATE('/', strInput, Swap + 1);
		SET NextSpace := IF(LEAST(NextSlash, NextSpace) = 0, GREATEST(NextSlash, NextSpace), LEAST(NextSlash, NextSpace));

	END WHILE label1;

RETURN result;

END$$
DELIMITER ;
```

# What it does

It seems to perform generally as I hoped it would; which is to say that it formats text to be sentence case.

More specifically, it alters all the "words" (a set of non-numeric, non-whitespace characters) that are longer than the specified minimum length.

It changes the words to be all lowercase, unless they happen to be the first word after a punctuation mark (in which case the first character of the word is made uppercase).

# Useage

To clean up a field so that it is formatted in sentence case (ignoring all words with less than 3 characters), simply run this query:

```
UPDATE `table` SET `field` = f_sentence_case(`field`, 3);
```

Other than that, my only specs for the query were for it to be functional and hopefully not break my brain when I went back to read it later.  If anyone has any significant improvements to it, let me know!
