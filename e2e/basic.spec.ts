import { test, expect } from '@playwright/test';

test('Ensuring page is loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await expect(page).toHaveTitle(/MYNE Chat/);
});

test('Ensuring we can add peerIds', async ({ page }) => {
  const mockPeerId = '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
  const myPeerId = '16Uiu2HAm91EuoZ6Sr4siiwUL89mdbmcwv9QUnLwoLBgvgGTg57Dh' // From mocks/index.js
  const helloWorldMessage = "Hi this a message from MyneChat"
  const mockedResponse = `mocked server has recevied "myne:${myPeerId}:${helloWorldMessage}" message`
  await page.goto('http://localhost:8080/');
  await page.locator('[aria-label="Add Peer Id"]').click();
  await page.locator('input[name="Peer Id"]').fill(mockPeerId)
  await page.locator('[aria-label="Add New Conversation"]').click();
  await expect(page.locator(`text=User Peer ID: ${mockPeerId}`))
    .toContainText(`User Peer ID: ${mockPeerId}`) // Title of current conversation
  await page.locator('textarea[name="Chat input"]').fill(helloWorldMessage)
  await page.locator('[aria-label="Send message"]').click();
  await expect(page.locator(`text=${mockedResponse}`))
    .toContainText(mockedResponse) // Response from mocked server
});
