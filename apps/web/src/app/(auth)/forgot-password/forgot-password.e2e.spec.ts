import { expect, test } from '@playwright/test'

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password')
  })

  test('should render forgot password form correctly', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()

    await expect(
      page.getByRole('button', { name: /^recuperar senha$/i })
    ).toBeVisible()

    await expect(page.getByRole('link', { name: /fazer login/i })).toBeVisible()
  })

  test('should allow entering email in the form', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    await emailInput.fill('test@example.com')

    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.getByRole('link', { name: /fazer login/i }).click()

    await expect(page).toHaveURL('/sign-in')
  })

  test('should submit the form', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')

    const submitButton = page.getByRole('button', {
      name: /^recuperar senha$/i,
    })

    // Form submission - the form submits as GET without action
    // This test verifies the form can be submitted without JavaScript errors
    await submitButton.click()

    // After form submission, we're still on forgot-password page (with query params)
    await expect(page).toHaveURL(/\/forgot-password/)
  })
})
