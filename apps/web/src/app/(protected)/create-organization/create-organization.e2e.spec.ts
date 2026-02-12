import { expect, test } from '@playwright/test'

test.describe('Create Organization Page', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/create-organization')
  })

  test('should render create organization form correctly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /criar uma nova organizacao/i })
    ).toBeVisible()

    await expect(page.getByLabel(/nome da organização/i)).toBeVisible()

    await expect(page.getByLabel(/dominio do e-mail/i)).toBeVisible()

    await expect(
      page.getByRole('checkbox', {
        name: /adicionar novos membros automaticamente/i,
      })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: /salvar organização/i })
    ).toBeVisible()
  })

  test('should show validation error for empty name field', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /salvar organização/i }).click()

    await expect(
      page.getByText(/O nome precisa ter pelo menos 4 caracteres/i)
    ).toBeVisible()
  })

  test('should show validation error for invalid domain format', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const organizationName = `Test Org ${uniqueId}`
    const invalidDomain = `domain-${uniqueId}`

    await page.getByLabel(/nome da organização/i).fill(organizationName)
    await page.getByLabel(/dominio do e-mail/i).fill(invalidDomain)

    await page.getByRole('button', { name: /salvar organização/i }).click()

    const errorMessage = page.getByText(/por favor, forneça um domínio válido/i)

    await expect(errorMessage).toBeVisible()
  })

  test('should show loading state when submitting form', async ({ page }) => {
    await page.getByLabel(/nome da organização/i).fill('Organização Teste E2E')

    const submitButton = page.getByRole('button', {
      name: /salvar organização/i,
    })
    await submitButton.click()

    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })

  test('should create organization successfully', async ({ page }) => {
    const uniqueId = Date.now()
    const organizationName = `Test Org ${uniqueId}`
    const uniqueDomain = `domain-${uniqueId}.com`

    await page.getByLabel(/nome da organização/i).fill(organizationName)
    await page.getByLabel(/dominio do e-mail/i).fill(uniqueDomain)

    await page.route('**/organizations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ organizationId: 'test-org-id' }),
        })
      } else {
        await route.continue()
      }
    })

    await page.getByRole('button', { name: /salvar organização/i }).click()

    await expect(
      page.getByText(/organização criada com sucesso/i)
    ).toBeVisible()
  })

  test('should create organization with auto-attach enabled', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const organizationName = `Test Org ${uniqueId}`
    const uniqueDomain = `domain-${uniqueId}.com`

    await page.getByLabel(/nome da organização/i).fill(organizationName)
    await page.getByLabel(/dominio do e-mail/i).fill(uniqueDomain)

    await page
      .getByRole('checkbox', {
        name: /adicionar novos membros automaticamente/i,
      })
      .check()

    await page.route('**/organizations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ organizationId: 'test-org-id' }),
        })
      } else {
        await route.continue()
      }
    })

    await page.getByRole('button', { name: /salvar organização/i }).click()

    await expect(
      page.getByText(/organização criada com sucesso/i)
    ).toBeVisible()
  })
})
