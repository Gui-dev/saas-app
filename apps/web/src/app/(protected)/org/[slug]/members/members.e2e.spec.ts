import fs from 'node:fs'
import { expect, type Page, test } from '@playwright/test'

// Read the auth token from storage state
const getAuthToken = (storageStatePath: string) => {
  try {
    const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'))
    const cookie = storageState.cookies.find(
      (c: { name: string }) => c.name === 'saas-token'
    )
    return cookie?.value || ''
  } catch {
    return ''
  }
}

// Helper to create organization and derive slug from name
const createOrganization = async (page: Page, name: string, domain: string) => {
  const token = getAuthToken('./playwright/.auth/admin.json')

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

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return { id: organizationId, slug, name }
}

test.describe('Organization Members Page', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test('should display members page for admin', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Members Org ${uniqueId}`
    const domain = `members${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify page loads with title
    await expect(page.locator('h1')).toContainText('Members')

    // Verify table has at least one row (the admin/owner)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should show role select for members', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Role Select Org ${uniqueId}`
    const domain = `roleselect${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify role select exists in the table
    const roleSelect = page.locator('[data-testid="role-select"]')
    await expect(roleSelect).toBeVisible()
  })

  test('should display invites section for admin', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Invites Org ${uniqueId}`
    const domain = `invites${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify "Convidar membro" section is visible (admin has create permission)
    await expect(page.getByText('Convidar membro')).toBeVisible()

    // Verify "Convidados" heading is visible (use h2 to be specific)
    await expect(page.locator('h2', { hasText: 'Convidados' })).toBeVisible()

    // Verify empty state message
    await expect(page.getByText('Não há convidados')).toBeVisible()
  })

  test('should display member details with owner badge', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Owner Badge Org ${uniqueId}`
    const domain = `ownerbadge${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify Members heading (h2)
    await expect(
      page.getByRole('heading', { name: 'Members' }).nth(1)
    ).toBeVisible()

    // Verify Owner badge is displayed (use exact match to avoid conflicts with org name)
    await expect(page.getByText('Owner', { exact: true })).toBeVisible()
  })

  test('should show transfer ownership button for admin', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Transfer Org ${uniqueId}`
    const domain = `transfer${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify Transfer ownership button is visible (admin has permission)
    await expect(
      page.getByRole('button', { name: 'Transfer ownership' })
    ).toBeVisible()
  })

  test('should show remove member button for admin', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Remove Org ${uniqueId}`
    const domain = `remove${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify Remove button is visible (admin has delete permission)
    await expect(page.getByRole('button', { name: 'Remover' })).toBeVisible()
  })

  test('should disable remove button for owner', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Disable Remove Org ${uniqueId}`
    const domain = `disableremove${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Find the remove button for the owner row (should be disabled)
    const removeButton = page.getByRole('button', { name: 'Remover' })
    await expect(removeButton).toBeVisible()
    await expect(removeButton).toBeDisabled()
  })

  test('should display create invite form for admin', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Create Invite Org ${uniqueId}`
    const domain = `createinvite${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/members`)

    await page.waitForSelector('table')

    // Verify invite form elements are present
    await expect(page.getByPlaceholder(/digite o e-mail/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /enviar convite/i })
    ).toBeVisible()
  })
})
