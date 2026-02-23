# ITAS276 Assignment #1
### Aiden Adzich
---

## Linting
Through my research I found the current primary linters being used are [ESLint](https://eslint.org/) and [Biome](https://biomejs.dev/). ESLint seems to be the industry standard, and has been around for a lot longer than Biome, which is quite recent. 

| Key | ESLint | Biome |
|---|---|---|
| **Speed** | Node.js based. Slower. | Much faster, built in Rust. |
| **Scope** | Linting Only | Linting, Formatting, Sorting |
| **Config** | Large amount of config and plugins required | Single file config, mostly pre-configured |
| **Support** | Plugins for anything you could need | No plugin system, limited but growing list of built in rules |

For the time being, I am going to continue with both ESLint and Biome in order to take advantage of the wide variety of plugins for ESLint, and the formatting and sorting features of biome. In the future if I were to switch to exclusively using ESLint, I would accompany it with Prettier and a import sorting plugin.

## Testing
When setting up my repository, I used Jest for my small amount of initial testing. While doing some research I also discovered vitest, which can be used for general testing, but is built specifically for Vite web apps.

| Key | Jest | Vitest |
| --- | --- | --- |
| **Speed** | Base | Comparable to Jest, can be much faster depending on the situation |
| **Scope** | CommonJS, React Native, Legacy Apps | Vite, ESM, React|
| **Config** | Complex configs for ESM or TS support | Zero config required, also pulls directly from vite.config |
| **Support** | Industry stand, huge ecosystem | Mostly compatiable with Jest |

In my case, I decided to switch to vitest as I am using Vite on my frontend, ESM on my backend, and it is fully compatible with my existing Jest tests.

## SCA
The two SCA tools I've found are [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/) and [Retire.js](https://github.com/RetireJS/retire.js). OWASP DC is a very heavy tool that supports a wide variety of languages, where Retire.js is more lightweight and built specifically for Javascript.

| Key | OWASP DC | Retire.js |
| --- | --- | --- |
| **Speed** | Slow. Runs very thorough testing. Downloads full vuln database | Much faster, very lightweight |
| **Scope** | Java, .NET, Ruby, Node.js, Python | Javascript |
| **Integration** | Seperate tool, requires Java | Node Modules |

I will be going with **Retire.js**, as OSWASP DC seems like it would be overkill for this project, and the simplicity of Retire is quite appealing.


