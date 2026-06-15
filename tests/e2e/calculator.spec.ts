import { expect, type Page, test } from '@playwright/test';

test.describe('calculator core flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Calculator' }),
    ).toBeVisible();
  });

  test('evaluates a basic calculation through button input', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Digit 2' }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Digit 3' }).click();
    await page.getByRole('button', { name: 'Multiply' }).click();
    await page.getByRole('button', { name: 'Digit 4' }).click();
    await page.getByRole('button', { name: 'Evaluate' }).click();

    await expectDisplayResult(page, '14');
  });

  test('evaluates a scientific calculation in scientific mode', async ({
    page,
  }) => {
    await page.getByRole('radio', { name: 'Scientific' }).click();
    await expect(page.getByLabel('Scientific keypad')).toBeVisible();

    await page.getByRole('button', { name: 'Square root' }).click();
    await page.getByRole('button', { name: 'Digit 8' }).click();
    await page.getByRole('button', { name: 'Digit 1' }).click();
    await page.getByRole('button', { name: 'Close parenthesis' }).click();
    await page.getByRole('button', { name: 'Evaluate' }).click();

    await expectDisplayResult(page, '9');
  });

  test('switches between basic and scientific keypads', async ({ page }) => {
    await expect(page.getByLabel('Scientific keypad')).toBeHidden();
    await expect(page.getByRole('radio', { name: 'Basic' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await page.getByRole('radio', { name: 'Scientific' }).click();
    await expect(page.getByLabel('Scientific keypad')).toBeVisible();
    await expect(
      page.getByRole('radio', { name: 'Scientific' }),
    ).toHaveAttribute('aria-checked', 'true');

    await page.getByRole('radio', { name: 'Basic' }).click();
    await expect(page.getByLabel('Scientific keypad')).toBeHidden();
  });

  test('supports keyboard entry for digits, operators, Enter, and Backspace', async ({
    page,
  }) => {
    await page.keyboard.press('2');
    await page.keyboard.press('+');
    await page.keyboard.press('3');
    await page.keyboard.press('5');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('*');
    await page.keyboard.press('4');
    await page.keyboard.press('Enter');

    await expectDisplayResult(page, '14');
  });
});

async function expectDisplayResult(page: Page, expected: string) {
  await expect(page.getByLabel('Calculator display')).toContainText(expected);
}
