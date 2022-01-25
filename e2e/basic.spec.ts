import { test, expect } from '@playwright/test';

test('Ensuring page is loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await expect(page).toHaveTitle(/MYNE Chat/);
});

test('Ensuring we can add peerIds', async ({ page }) => {
  const mockPeerId = '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
  await page.goto('http://localhost:8080/');
  await page.locator('[aria-label="Add Peer Id"]').click();
  await page.locator('input[name="Peer Id"]').fill(mockPeerId)
  await page.locator('[aria-label="Add New Conversation"]').click();
  await expect(page.locator(`text=${mockPeerId}`)).toBeTruthy();
});
