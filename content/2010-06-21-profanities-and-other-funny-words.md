title: Profanities and other funny words
date: 2010-06-21T03:11:00-06:00
categories: geekery

I recently did a quick audit of the source code I help maintain/develop for [the company I work for](http://wikido.isoftdata.com/index.php/ISoft_Data_Systems).  By which I mean, I spent the last part of a Friday searching through our code for funny words.

I decided to open up by looking for traditional profanities - a commonly-accepted method of gauging the state of a project (see: [profanities in the Linux kernel, graphed over time](http://www.vidarholen.net/contents/wordcount/) and [a quick look at the Win2k source](http://www.kuro5hin.org/story/2004/2/15/71552/7795)).

Below, I provide a list of my findings, with a few examples.  Enjoy a look at the source code of a functioning product with many users!

_Disclaimer: if any of the words that you are about to read will offend you, then don't read them._

# The classics

I started off by looking for looking for the current English classics:

**Fuck**: 6 times.
Example:
<pre>// If they had any unsaved changes, they're pretty much fucked, because
// this customer has apparently been modified by another screen.</pre>

**Shit**: 10
<pre>// For now, I believe that all the data is updated on the fly, so saving first is not
// necessary, but maybe we should just for shits and giggles</pre>

**Crap**: 22
The expletive for the more vocabulary-sensitive programmer!
<pre>//!!! It was late, we were tired, so I hacked this crap together !!!</pre>
<!-- wut -->
<pre>// What the crap does this button do? - I disabled it because I think that this button
// is misleading and confusing</pre>

**Hell**: 1
<pre>// If it wasn't any of the valid options, then get the hell out</pre>

# Insults

It's usually another programmer's fault.

**Stupid**: 75
The code is stupid, the users are stupid, other developers are stupid.  According to the comments, at least.
<pre>// Clear out year if it is a stupid number</pre>
<!-- wut -->
<pre>// Here we tell the user they are stupid when they do stupid things
// If the user forgets to specify a table, gently remind them that it's a good idea,
// then return</pre>
<!-- wut -->
<pre>// When you minimize, it tells you you're size 0 now.  That seems stupid, ignore it</pre>
<!-- wut -->
<pre>// Die, stupid message boxes</pre>
<!-- wut -->
<pre>TRACE("Stupid quickbooks.\n");</pre>
<!-- wut -->
<pre>IQBBasePtr stupid = response-&gt;GetDetail();
TRACE("Response Type: %d\n", (int)stupid-&gt;Type-&gt;GetValue());
InterpretResponse(stupid);</pre>
<!-- wut -->
<pre>// Thigs are different (stupid) without this flag.  I don't currently support its omission</pre>

**Dumb**: 17
<pre>// There was some seriously wacky code here earlier including a really dumb memory leak.
// I tested my changes and they seem to work fine, nevertheless, I wasn't able
// to fully understand what this code was attempting to do so I may have missed
// some obscure feature.</pre>

**Retarded**: 4
<pre>// Because CStrings are retarded and don't do well with binary data, we have to copy the
// data in to the query in a rather inconvenient manner.</pre>

**Idiot**: 2
<pre>// Else politely inform the user that they are an idiot</pre>

**Hack**: 6
<pre>// Look at the first part of the label to find the operation (this is a sort of 
// dirty hack so that) we don't have to change the database.</pre>

# Incredulity

Really?

**Why**: 84
The only word with a higher count than "stupid" - there is always more for a programmer to learn.  Or speculate on.  Or rage at.
<pre>//!!! For some reason ODBC crashes at this point if you've already done a query !!!
//!!! I can't really figure out why !!!</pre>
<!-- wut -->
<pre>// Not sure why we would want to do bitwise operations...</pre>
<!-- wut -->
<pre>// WHy doesn't this exist?</pre>
<!-- wut -->
<pre>// I don't see why we'd do this</pre>
<!-- wut -->
<pre>// CRH asks: Why do we use Format() instead of "="? Can't we assume that it's slower?
// JDD Answers: what Formats?  What are you talking about?  You crazy, Charles!</pre>
<!-- wut -->
<pre>// Removed 2006.02.17 - This makes it so that negative balances show up positive.
// I am not sure sure why it was ever here.</pre>
<!-- wut -->
<pre>// This doesn't seem to work.  I'm not sure why</pre>

**wtf**: 25
Often heard expressed verbally by developers reading code.
<pre>catch (...)
{
	TRACE("Seriously, wtf\n");
	// sic vita est
}</pre>
<!-- wut -->
<pre>// Sort the incoming files alphabetically (windows sometimes reverses the order (wtf?)</pre>

# Random

**Ridiculous**: 2
When three syllables just isn't enough.
<pre>// Make the quantity not have ridiculous decimal places</pre>

**Pants**: 3
That's right, and all 3 times inside of a static string, too!
<pre>strPCProductCode = GetInitSetting(__MASTERWND, "session", "productcode", "pants");</pre>
That fourth argument is the default value, returned if there is no existing setting with that name.  So... yeah.

**lol**: 3
<pre>// lol xor
if ((bPaid || bUnpaid) &amp;&amp; !(bPaid &amp;&amp; bUnpaid))</pre>

**lulz**: 1
<pre>// Half implemented, lulz</pre>

# A few other gems

Ebonics?
<pre>// If shift was already depressed, fo' real, don't screw that up</pre>
Obvious mental deterioration:
<pre>// A grape typed this line in:
//9</pre>

And... uh... this was at the bottom of a header file...
<pre>// Standardized code makes him happy!
;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                        ;;
;;        ;;;;;;;;        ;;
;;       ;;      ;;       ;;
;;      ;; ;;  ;; ;;      ;;
;;      ;;        ;;      ;;
;;      ;;    ;   ;;      ;;
;;      ;;        ;;      ;;
;;      ;; ;;;;;; ;;      ;;
;;       ;;  ;;  ;;       ;;
;;        ;;;;;;;;        ;;
;;                        ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;

// Non-Standardized code makes him sad!
// And keeps him up all night, screaming
;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                        ;;
;;        ;;;;;;;;        ;;
;;       ;;;    ;;;       ;;
;;      ;; /*\/*\ ;;      ;;
;;      ;; \_/\_/ ;;      ;;
;;      ;;   ^^   ;;      ;;
;;      ;; /****\ ;;      ;;
;;      ;; \****/ ;;      ;;
;;       ;;      ;;       ;;
;;        ;;;;;;;;        ;;
;;                        ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;</pre>
8-|

# So, yeah...

Found any entertaining metadata in code?  Link me!