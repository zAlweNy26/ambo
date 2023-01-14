# Ambo!

## 📝 Descrizione

Gioco della tombola digitale, per quando non hai voglia di portarti la scatola!

## 🚀 Strumenti utilizzati

- Firebase
- TypeScript
- Vue
- Vite

## 📚 Librerie Tailwind CSS che ho utilizzato

[Myna UI](https://mynaui.com)

[Daisy UI](https://daisyui.com/components)

[Meraki UI](https://merakiui.com/components)

[Kitwind](https://kitwind.io/products/kometa/components)

[Tailwind UI](https://tailwindui.com/components)

## ✨ Funzionalità

- [x] Creazione automatica delle puntate
- [ ] Annuncio in caso di ambo, terna, ecc... per i giocatori
- [x] Modalità scura
- [x] Modalità schermo intero
- [x] Sintetizzatore vocale che annuncia i numeri per il banco
- [x] Scelta tra le varie versioni di tombola esistenti
- [x] Protezione dalla ricarica indesiderata

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
