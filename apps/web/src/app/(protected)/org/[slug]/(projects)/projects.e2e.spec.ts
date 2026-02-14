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

test.describe('Projects Page', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test('should display projects page with create button for admin', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const orgName = `Projects Org ${uniqueId}`
    const domain = `projects${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}`)

    // Verify page title
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()

    // Verify create project button is visible (admin has create permission)
    await expect(
      page.getByRole('link', { name: /criar projeto/i })
    ).toBeVisible()
  })

  test('should display empty project list', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Empty Projects Org ${uniqueId}`
    const domain = `emptyprojects${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}`)

    // Verify page loads with title
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })
})

test.describe('Projects Page - Create Project Button', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test('should navigate to create project page', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Navigate Org ${uniqueId}`
    const domain = `navigate${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}`)

    // Click on create project button
    const createButton = page.getByRole('link', { name: /criar projeto/i })
    await expect(createButton).toBeVisible()

    await createButton.click()

    // Verify navigation to create project page
    await expect(page).toHaveURL(new RegExp(`/org/${org.slug}/create-project`))
  })
})
