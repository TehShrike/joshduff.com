---
title: I like building inventory software
date: "2025-04-09T16:29:53.129Z"
summary: Reality has a surprising amount of detail
---

Inventory software takes something about the world and represents it in a database so the people who care (like the people who own the things, or the people responsible for selling them) can look it up easily.

How much did we pay for it?  What are we selling it for?  Do we have any with this model number? And the ever-present "how much of it do we have left?"

Tell a developer about the inventory count process and it sounds simple enough to implement.  A human tells the software how many of a Thing there is on the shelves, and you run a database query to change the inventory quantity to that number.

Except that wouldn't represent Reality.  The Reality is that if you find fewer Things than you expected, there's a pretty decent chance that you'll discover the missing items somewhere else in a week or so.  Or you'll find them on the same shelf where they didn't exist when you were looking at it today.  Or you'll find *more* of them next week than you thought you had.  So, while the fact that the human found fewer Things than you were expecting is *important*, you can't exactly represent it in the database as *reality*.

Even worse, if it turns out that after 3-12 months that everyone in the company is on board with the reality of "okay, that Thing is gone and we won't be able to sell it", it's still not an *accounting* reality.  You know who changes the amount of inventory they have in stock without a paper trail?  People that the IRS wants to throw in jail, that's who.  And you don't want to be those folks.

When the company is finally ready to write that lost inventory off its books, you need to remove it with a document, something nice and legible, something that creates general ledger entries that credit inventory and debit some expense account.

And what happens if you find that Thing again 13 months after you first lost it?  Well, maybe it's easiest if someone just takes it home, I don't know.  I mean, uh, ask your accountant.

## That sounds like a lot of work to model

This is the case in almost every aspect of business software.  These softwares make the real world legible to the people who need to know about it to do their job – if not physical reality, then accounting reality, or the reality of promises we made to someone while they were paying us for something, or some other kind of reality that matters to the company.

Software that interacts with the world is full of edge cases, dealing with weird behaviors that people evolved before anyone forced them to represent it in a spreadsheet.

You can't make all the complications disappear with software, but with enough thought and iteration and talking to the people interacting with the world, you can make reality easier to work with, and I find that incredibly satisfying.

---

*The post summary is a nod to [this excellent post](http://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail)*

::how_i_think_about_software::
