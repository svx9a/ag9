import { test, expect } from '@playwright/test';

test.describe('Matrix Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display the matrix visualization section', async ({ page }) => {
    const section = page.locator('#matrix-calculation');
    await expect(section).toBeVisible();
    await expect(section).toContainText('Calculate Your Agricultural Efficiency');
  });

  test('should update calculations when farm size is changed', async ({ page }) => {
    const slider = page.locator('#farm-size');
    const investmentText = page.locator('span.text-2xl.font-black.text-blue-600');
    
    const initialInvestment = await investmentText.textContent();
    
    // Move slider to 200 Rai
    await slider.fill('200');
    
    const updatedInvestment = await investmentText.textContent();
    expect(updatedInvestment).not.toBe(initialInvestment);
  });

  test('should update when drone model is changed', async ({ page }) => {
    const model6L = page.getByRole('button', { name: /AgriFlight Compact 6L/i });
    const investmentText = page.locator('span.text-2xl.font-black.text-blue-600');
    
    await model6L.click();
    
    await expect(investmentText).toContainText('฿135,000'); // Initial for 6L without extra batteries
  });

  test('should show warning for large areas with small drones', async ({ page }) => {
    const slider = page.locator('#farm-size');
    const model6L = page.getByRole('button', { name: /AgriFlight Compact 6L/i });
    
    await model6L.click();
    await slider.fill('450');
    
    const warning = page.locator('.animate-shake');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Recommended Configuration Alert');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    const section = page.locator('#matrix-calculation');
    await expect(section).toBeVisible();
    
    // Check if grid stacks
    const grid = page.locator('.grid-cols-1');
    await expect(grid.first()).toBeVisible();
  });
});
