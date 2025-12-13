---
title: On useful tests
date: "2025-12-11T12:32:05"
summary: Which automated tests are worth the bytes?
---

When your automated test suite reports failure, it's generally one of:

1. Someone changed the software and as an unintentional side effect something isn't working the way it's supposed to.
2. Someone changed the software intentionally, and the test is failing because it's asserting something untrue.
3. Nothing changed about the software, but sometimes the test just fails, and you have to run it again without changing anything

People call #3 "flaky" tests.  I don't have much to say about them.  Dan Luu referenced the idea in his [normalization of deviance](https://danluu.com/wat/) post for good reason.  Better to delete them.

Having seen thousands of test assertions in open source and corporate repositories, the main friction I see is between cases 1 and 2.

#1 is the dream, it's the ostensible reason why we write all those tests.  In practice, #2 seems much more likely.  Sometimes it's because the test was written intentionally, but the developer's intentions have changed.  More often, the test fails because the assertion relies on a dozen unrelated things that could legitimately change, that should never be a part of an automated test.

One project that I worked on had unit tests for every client-side React component.  They were all of the same variety – they relied on a bunch of mocks, so they didn't interact with the server or any framework code, they would simulate a button click, and then they would assert that the component contained the text that was supposed to be displayed after e.g. the item was successfully saved in the database.

These tests provided no value – the only thing tested was that the "successfully saved" text hadn't changed since the test was last touched.  The only reason the test would ever fail would be because someone decided to change the copy.  At best, the tests asserted that React's internals were still working.

It's easy to make the call that 99% of the tests in that repository should have been deleted, but even in a thoughtfully curated codebase, you have to play on the spectrum between the two extremes.  You're always trying to maximize the ratio of "chance of catching something actually going wrong" to "likelihood of failing for unrelated reasons".

If you want to assert that the server doesn't respond with a 500 error when you click the "save" button, how should you identify the element to be clicked?  Do you target the `button` with a `save` class?  Do you find an element that contains the text `/save/i`?  Do you take a screenshot of the screen every time the test runs, upload it to an LLM, and have it tell you where to click?

Depending on your codebase and the conventions your team decides on, your answer will vary.  What matters is to deliberately steer your test suite so that when a test fails, it is more likely to be catching an actual problem rather than making "fix the tests" busywork.
