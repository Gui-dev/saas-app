import { expect, test } from '@playwright/test'

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in')
  })

  test('should render sign in form correctly', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^senha$/i)).toBeVisible()

    await expect(page.getByRole('button', { name: /^entrar$/i })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /entrar com o github/i })
    ).toBeVisible()

    await expect(
      page.getByRole('link', { name: /esqueceu sua senha/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /não tem uma conta/i })
    ).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /^entrar$/i }).click()

    await expect(page.getByText(/por favor, forneça um e-mail/i)).toBeVisible()
    await expect(page.getByText(/por favor, forneça uma senha/i)).toBeVisible()
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /não tem uma conta/i }).click()

    await expect(page).toHaveURL('/sign-up')
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /esqueceu sua senha/i }).click()

    await expect(page).toHaveURL('/forgot-password')
  })

  test('should show loading state when submitting form', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^senha$/i).fill('password123')

    const submitButton = page.getByRole('button', { name: /^entrar$/i })
    await submitButton.click()

    // Check that the button shows loading spinner (form is submitting)
    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })

  test('should prefill email from query parameter', async ({ page }) => {
    await page.goto('/sign-in?email=test@example.com')

    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com')
  })
})
