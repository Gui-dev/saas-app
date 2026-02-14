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

test.describe('Create Project Page', () => {
  test.use({ storageState: './playwright/.auth/admin.json' })

  test('should render create project form correctly', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Create Project Org ${uniqueId}`
    const domain = `createproject${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    // Verify page title
    await expect(
      page.getByRole('heading', { name: /criar um novo projeto/i })
    ).toBeVisible()

    // Verify form fields
    await expect(page.getByLabel(/nome do projeto/i)).toBeVisible()

    await expect(page.getByLabel(/descrição/i)).toBeVisible()

    // Verify submit button
    await expect(
      page.getByRole('button', { name: /salvar projeto/i })
    ).toBeVisible()
  })

  test('should show validation error for empty name field', async ({
    page,
  }) => {
    const uniqueId = Date.now()
    const orgName = `Validation Org ${uniqueId}`
    const domain = `validation${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    // Submit form without filling name
    await page.getByRole('button', { name: /salvar projeto/i }).click()

    // Verify validation error
    await expect(
      page.getByText(/o nome precisa ter pelo menos 4 caracteres/i)
    ).toBeVisible()
  })

  test('should show validation error for short name', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Short Name Org ${uniqueId}`
    const domain = `shortname${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    // Fill name with less than 4 characters
    await page.getByLabel(/nome do projeto/i).fill('ab')

    await page.getByRole('button', { name: /salvar projeto/i }).click()

    // Verify validation error
    await expect(
      page.getByText(/o nome precisa ter pelo menos 4 caracteres/i)
    ).toBeVisible()
  })

  test('should show loading state when submitting form', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Loading Org ${uniqueId}`
    const domain = `loading${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    await page.getByLabel(/nome do projeto/i).fill('Projeto Teste E2E')

    const submitButton = page.getByRole('button', { name: /salvar projeto/i })
    await submitButton.click()

    // Verify loading spinner is visible
    await expect(page.locator('svg.animate-spin')).toBeVisible()
  })

  test('should create project successfully', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `Success Org ${uniqueId}`
    const domain = `success${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    const projectName = `Projeto Teste ${uniqueId}`
    const projectDescription = `Descrição do projeto ${uniqueId}`

    await page.getByLabel(/nome do projeto/i).fill(projectName)
    await page.getByLabel(/descrição/i).fill(projectDescription)

    // Mock the API call to create project
    await page.route(`**/organizations/${org.slug}/projects`, async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ projectId: 'test-project-id' }),
        })
      } else {
        await route.continue()
      }
    })

    await page.getByRole('button', { name: /salvar projeto/i }).click()

    // Verify success message
    await expect(page.getByText(/projeto criado com sucesso/i)).toBeVisible()
  })

  test('should create project with description', async ({ page }) => {
    const uniqueId = Date.now()
    const orgName = `With Description Org ${uniqueId}`
    const domain = `withdesc${uniqueId}.com`

    const org = await createOrganization(page, orgName, domain)

    await page.goto(`/org/${org.slug}/create-project`)

    const projectName = `Projeto Completo ${uniqueId}`
    const projectDescription = `Esta é uma descrição detalhada do projeto ${uniqueId} criado durante os testes E2E`

    await page.getByLabel(/nome do projeto/i).fill(projectName)
    await page.getByLabel(/descrição/i).fill(projectDescription)

    // Mock the API call
    await page.route(`**/organizations/${org.slug}/projects`, async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ projectId: 'test-project-id' }),
        })
      } else {
        await route.continue()
      }
    })

    await page.getByRole('button', { name: /salvar projeto/i }).click()

    // Verify success message
    await expect(page.getByText(/projeto criado com sucesso/i)).toBeVisible()
  })
})
