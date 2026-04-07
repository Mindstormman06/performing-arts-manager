# ITAS276 Assignment #2
### Aiden Adzich
---

## BDD
For my BDD testing, two options I found are [Cucumber.js](https://github.com/cucumber/cucumber-js) and [Jest-Cucumber](https://www.npmjs.com/package/jest-cucumber). Both support Gherkin through .feature files, and are functionally quite similar as Jest-Cucumber is based on Cucumber.js.
| Key | Cucumber.js | Jest-Cucumber |
|---|---|---|
| **Speed** | Slower, runs it's own process | Runs as part of Jest tests |
| **Syntax** | Closer to English, much easier to read | Requires more technical Jest functions |
| **Config** | Standalone config | Not required if Jest is already setup |

If I had stuck with Jest for my unit tests, then Jest-Cucumber would likely be the better option for my tests; however, due to me previously switching to Vitest, I am going to go with Cucumber.JS for my BDD testing.

## UI
For UI tests, my two options are the previously mentioned [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev).
| Key | Playwright | Vitest |
|---|---|---|
| **Type** | E2E Testing | Unit Tests |
| **Speed** | Slow, navigates web pages | Very fast, runs isolated tests |
| **Scope** | Full navigaton through web-app | Isolated components |
| **Environment** | Browsers | Simulated DOM |

While I did previously choose Vitest for my backend testing, in part because I could use it for the frontend as well, I'm actually going to go with Playwright for my UI testing. I believe the automated testing in a browser will be much more valuable to me at this point than unit tests on the frontend; however, I will likely be implementing Vitest in the future to cover all bases.

## UAT
For UAT, I struggled a bit to find two different options, as I wasn't solid on the differences from the other types of testing. In the end, I settled on [Robot Framework](https://robotframework.org/) and [Selenium](https://www.selenium.dev/).
| Key | Robot Framework | Selenium |
|---|---|---|
| **Testing Approach** | Keywords | Python |
| **Readability** | Simple, highly readable via keywords | Complex, standard code |
| **Web Library** | Supports multiple libraries | Is the library |

I'm writing this after making the tests, as I wasn't completely sure yet, so I tried out both.