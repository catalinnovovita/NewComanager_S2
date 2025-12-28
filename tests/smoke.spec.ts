import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/AI COMANAGER/i);
});

test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
});
