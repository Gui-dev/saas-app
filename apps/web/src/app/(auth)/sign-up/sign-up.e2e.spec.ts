import { expect, test } from '@playwright/test'

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up')
  })

  test('should render sign up form correctly', async ({ page }) => {
    await expect(page.getByLabel(/nome/i)).toBeVisible()
    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/^senha$/i)).toBeVisible()
    await expect(page.getByLabel(/confirmar a senha/i)).toBeVisible()

    await expect(
      page.getByRole('button', { name: /^criar conta$/i })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /criar conta com o github/i })
    ).toBeVisible()

    await expect(
      page.getByRole('link', { name: /já tem uma conta/i })
    ).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /^criar conta$/i }).click()

    await expect(
      page.getByText(/por favor, forneça um nome completo/i)
    ).toBeVisible()
    await expect(page.getByText(/por favor, forneça um e-mail/i)).toBeVisible()
    await expect(page.getByText(/por favor, forneça uma senha/i)).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByLabel(/nome/i).fill('Test User')
    await page.getByLabel(/e-mail/i).fill('invalid-email')
    await page.getByLabel(/^senha$/i).fill('password123')
    await page.getByLabel(/confirmar a senha/i).fill('password123')

    await page.getByRole('button', { name: /^criar conta$/i }).click()

    await expect(
      page.getByText(/por favor, forneça um e-mail valido/i)
    ).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel(/nome/i).fill('Test User')
    await page.getByLabel(/e-mail/i).fill('test@example.com')
    await page.getByLabel(/^senha$/i).fill('password123')
    await page.getByLabel(/confirmar a senha/i).fill('differentpassword')

    await page.getByRole('button', { name: /^criar conta$/i }).click()

    await expect(page.getByText(/as senhas devem ser iguais/i)).toBeVisible()
  })

  test('should show error for short password', async ({ page }) => {
    await page.getByLabel(/nome/i).fill('Test User')
    await page.getByLabel(/e-mail/i).fill('test@example.com')
    await page.getByLabel(/^senha$/i).fill('123')
    await page.getByLabel(/confirmar a senha/i).fill('123')

    await page.getByRole('button', { name: /^criar conta$/i }).click()

    await expect(
      page.getByText(
        /por favor, forneça uma senha com pelo menos 6 caracteres/i
      )
    ).toBeVisible()
  })

  test('should show error for single word name', async ({ page }) => {
    await page.getByLabel(/nome/i).fill('Test')
    await page.getByLabel(/e-mail/i).fill('test@example.com')
    await page.getByLabel(/^senha$/i).fill('password123')
    await page.getByLabel(/confirmar a senha/i).fill('password123')

    await page.getByRole('button', { name: /^criar conta$/i }).click()

    await expect(
      page.getByText(/por favor, forneça um nome completo/i)
    ).toBeVisible()
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.getByRole('link', { name: /já tem uma conta/i }).click()

    await expect(page).toHaveURL('/sign-in')
  })

  test('should show loading state when submitting form', async ({ page }) => {
    // Fill the form with valid data
    await page.getByLabel(/nome/i).fill('Test User Name')
    await page.getByLabel(/e-mail/i).fill('test@example.com')
    await page.getByLabel(/^senha$/i).fill('password123')
    await page.getByLabel(/confirmar a senha/i).fill('password123')

    const submitButton = page.getByRole('button', { name: /^criar conta$/i })
    await submitButton.click()

    // Check that the button shows loading spinner (form is submitting)
    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })
})
