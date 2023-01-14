import { test, expect } from '@playwright/test'

// https://test-utils.vuejs.org/guide/#what-is-vue-test-utils
// https://playwright.dev/docs/intro

test('Has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Ambo!/)
})
