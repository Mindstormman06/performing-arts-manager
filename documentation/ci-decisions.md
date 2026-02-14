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