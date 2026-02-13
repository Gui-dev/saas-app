import fs from 'node:fs'
import { expect, test } from '@playwright/test'

// Read the auth token from storage state
const getAuthToken = () => {
  try {
    const storageState = JSON.parse(
      fs.readFileSync('./playwright/.auth/admin.json', 'utf-8')
    )
    const cookie = storageState.cookies.find(
      (c: { name: string }) => c.name === 'saas-token'
    )
    return cookie?.value || ''
  } catch {
    return ''
  }
}

// Helper to create organization and derive slug from name
const createOrganization = async (page: any, name: string, domain: string) => {
  const token = getAuthToken()

  // Create organization via API
  const response = await page.request.post(
    'http://localhost:3333/organizations',
    {
      data: {
        name,
        domain,
        shouldAttachUsersByDomain: false,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok()) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create organization: ${response.status()} ${errorText}`
    )
  }

  const { organizationId } = await response.json()
  expect(organizationId).toBeDefined()

  // Derive slug from name (kebab-case, lowercase)
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return { id: organizationId, slug, name }
}

test.describe('Organization Settings Page', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test('should submit organization update form', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Test Org ${uniqueId}`
    const domain = `test${uniqueId}.com`

    // Create organization
    const org = await createOrganization(page, orgName, domain)

    // Navigate to the settings page
    await page.goto(`/org/${org.slug}/settings`)

    // Mock the PUT request for update to prevent actual API call
    await page.route(`**/organizations/${org.slug}`, async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            organization: {
              id: org.id,
              name: 'Updated Organization',
              slug: org.slug,
              domain: 'updated.com',
              shouldAttachUsersByDomain: true,
            },
          }),
        })
      } else {
        await route.continue()
      }
    })

    // Update the organization
    await page.getByLabel(/nome da organização/i).fill('Updated Organization')
    await page.getByLabel(/dominio do e-mail/i).fill('updated.com')
    await page
      .getByRole('checkbox', {
        name: /adicionar novos membros automaticamente/i,
      })
      .check()

    await page.getByRole('button', { name: /salvar organização/i }).click()

    // Check for loading state (form is being submitted)
    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })

  test('should show validation error for empty organization name', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const orgName = `Validation Org ${uniqueId}`

    // Create organization
    const org = await createOrganization(
      page,
      orgName,
      `validation${uniqueId}.com`
    )

    // Navigate to settings
    await page.goto(`/org/${org.slug}/settings`)

    // Clear name and submit
    await page.getByLabel(/nome da organização/i).clear()
    await page.getByRole('button', { name: /salvar organização/i }).click()

    // Check validation error
    await expect(
      page.getByText(/O nome precisa ter pelo menos 4 caracteres/i)
    ).toBeVisible()
  })

  test('should show validation error for invalid domain format', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const orgName = `Domain Test Org ${uniqueId}`

    // Create organization
    const org = await createOrganization(page, orgName, `domain${uniqueId}.com`)

    // Navigate to settings
    await page.goto(`/org/${org.slug}/settings`)

    // Fill with invalid domain
    await page.getByLabel(/nome da organização/i).fill('Test Organization')
    await page.getByLabel(/dominio do e-mail/i).fill('invalid-domain')

    await page.getByRole('button', { name: /salvar organização/i }).click()

    // Check validation error
    await expect(
      page.getByText(/por favor, forneça um domínio válido/i)
    ).toBeVisible()
  })

  test('should show loading state when submitting form', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Loading Test Org ${uniqueId}`

    // Create organization
    const org = await createOrganization(
      page,
      orgName,
      `loading${uniqueId}.com`
    )

    // Navigate to settings
    await page.goto(`/org/${org.slug}/settings`)

    // Fill form and submit
    await page.getByLabel(/nome da organização/i).fill('New Organization Name')
    await page.getByRole('button', { name: /salvar organização/i }).click()

    // Check loading spinner
    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })

  test('should delete organization and redirect to home', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Delete Test Org ${uniqueId}`
    const domain = `deletetest${uniqueId}.com`

    // Create organization
    const org = await createOrganization(page, orgName, domain)

    // Navigate to settings
    await page.goto(`/org/${org.slug}/settings`)

    // Mock the DELETE request for shutdown
    await page.route(`**/organizations/${org.slug}`, async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
        })
      } else {
        await route.continue()
      }
    })

    // Click delete button
    await page.getByRole('button', { name: /deletar organização/i }).click()

    // Wait for navigation to home
    await expect(page).toHaveURL('/')
  })

  test('should display delete organization section for admin users', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const orgName = `Auth Delete Org ${uniqueId}`
    const domain = `authdelete${uniqueId}.com`

    // Create organization
    const org = await createOrganization(page, orgName, domain)

    // Navigate to settings
    await page.goto(`/org/${org.slug}/settings`)

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Verify delete organization section is visible using CardTitle text
    await expect(
      page.getByText('Deletar orgnização', { exact: false })
    ).toBeVisible()

    // Verify description text
    await expect(
      page.getByText(/isso irá apagar todos os dados da organização/i)
    ).toBeVisible()

    // Verify delete button is present
    await expect(
      page.getByRole('button', { name: /deletar organização/i })
    ).toBeVisible()
  })
})
