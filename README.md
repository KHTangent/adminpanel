# Nuxt 3 and Vuetify starter

Personal starter for projects with Nuxt 3 and Vuetify 3. Feel free to use it, but I take no responsibility if anything goes wrong.

## What's included

- Nuxt 3 starter
- Vuetify 3 with Nuxt plugin (credit: [Cody Bontecou](https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html#configure-nuxt-3-to-use-our-new-plugin))
- `@mdi/js` SVG icon pack
- Prettier, with a Husky pre-commit hook
- Make Prettier use tabs for indentation
- Pre-made header and footer
- Default layout to include the header and footer
- Two pages, to test navigation
- Simple Dockerfile, should it be needed

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

Note: Completion in VS Code with Volar will not work unless you've ran the dev server at least once.

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
