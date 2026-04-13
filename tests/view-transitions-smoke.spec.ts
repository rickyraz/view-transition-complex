import { expect, test } from '@playwright/test'

test.describe('View Transition smoke checks', () => {
  test('complex route can run sync sequence end-to-end', async ({ page }) => {
    await page.goto('/complex')

    await expect(page.getByRole('heading', { name: 'Complex Route' })).toBeVisible()
    await page.getByRole('button', { name: 'Launch sync sequence' }).click()

    await expect(page.locator('.mission-core .stage')).toContainText('syncing')
    await expect(page.locator('.mission-core .stage')).toContainText('resolved')
  })

  test('edge route keeps detail panel in sync with selected alert', async ({ page }) => {
    await page.goto('/edge')

    await page.getByRole('button', { name: /Auth refresh mismatch/i }).first().click()

    await expect(page.locator('.edge-detail h3')).toHaveText('Auth refresh mismatch')
    await expect(page.locator('.edge-detail')).toContainText('Owner: Mona')
  })

  test('concurrent stores route can enqueue events without collisions', async ({ page }) => {
    await page.goto('/concurrent-stores')

    const pushA = page.getByRole('button', { name: 'Push source A' })
    const pushB = page.getByRole('button', { name: 'Push source B' })

    await pushA.click()
    await pushB.click()
    await pushA.click()

    await expect(page.getByRole('heading', { name: /Queue \(3\)/ })).toBeVisible()
    await expect(page.locator('.metric-list li')).toHaveCount(3)
  })
})
