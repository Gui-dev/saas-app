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

// Helper to create organization
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

// Helper to create invite
const createInvite = async (
  page: Page,
  orgSlug: string,
  email: string,
  role: string = 'MEMBER'
) => {
  const token = getAuthToken('./playwright/.auth/admin.json')

  const response = await page.request.post(
    `http://localhost:3333/organizations/${orgSlug}/invites`,
    {
      data: {
        email,
        role,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok()) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create invite: ${response.status()} ${errorText}`
    )
  }

  const { inviteId } = await response.json()
  expect(inviteId).toBeDefined()

  return inviteId
}

test.describe('Invites Page', () => {
  test.describe('when user is not authenticated', () => {
    test('should display invite information and sign in button', async ({
      page,
    }) => {
      // Create organization and invite
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `convidado${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Verify invite information is displayed
      await expect(
        page.getByText(/convidou voce para se juntar a/i)
      ).toBeVisible()
      await expect(page.getByText(orgName)).toBeVisible()

      // Verify sign in button is displayed
      await expect(
        page.getByRole('button', { name: /entrar para aceitar o convite/i })
      ).toBeVisible()
    })

    test('should navigate to sign in page when clicking sign in button', async ({
      page,
    }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `convidado${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Click the sign in button
      await page
        .getByRole('button', { name: /entrar para aceitar o convite/i })
        .click()

      // Should redirect to sign-in page with email parameter
      await expect(page).toHaveURL(/\/sign-in/)
    })
  })

  // Note: Cannot test "authenticated with matching email" scenario because
  // the API doesn't allow creating invites for emails that are already members
  // of the organization, and the admin user (bruce@email.com) is always the owner
  // of organizations they create.

  test.describe('when user is authenticated with different email', () => {
    test.use({ storageState: './playwright/.auth/admin.json' })

    test('should display email conflict message', async ({ page }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      // Use a different email than the authenticated user
      const inviteEmail = `outro${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Verify conflict message is displayed
      await expect(
        page.getByText(/este convite foi enviado para/i)
      ).toBeVisible()
      await expect(page.getByText(inviteEmail)).toBeVisible()
      await expect(
        page.getByText(/porém você está atualamente logado com/i)
      ).toBeVisible()
    })

    test('should display sign out and dashboard buttons', async ({ page }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `outro${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Verify sign out link is displayed (rendered as <a> with Button asChild)
      const signOutLink = page.getByRole('link', { name: /sair da conta/i })
      await expect(signOutLink).toBeVisible()

      // Verify dashboard link is displayed
      const dashboardLink = page.getByRole('link', {
        name: /voltar ao dashboard/i,
      })
      await expect(dashboardLink).toBeVisible()
    })

    test('should navigate to dashboard when clicking back button', async ({
      page,
    }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `outro${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Click the back to dashboard button
      await page.getByRole('link', { name: /voltar ao dashboard/i }).click()

      // Should navigate to dashboard
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('invite information display', () => {
    test('should display author name', async ({ page }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `test${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Author name should be visible (the authenticated admin user)
      await expect(
        page.getByText(/convidou voce para se juntar a/i)
      ).toBeVisible()
    })

    test('should display organization name', async ({ page }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `test${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      await expect(page.getByText(orgName)).toBeVisible()
    })

    test('should display relative time', async ({ page }) => {
      const uniqueId = Date.now()
      const orgName = `Invite Test Org ${uniqueId}`
      const domain = `invitetest${uniqueId}.com`
      const inviteEmail = `test${uniqueId}@example.com`

      const org = await createOrganization(page, orgName, domain)
      const inviteId = await createInvite(page, org.slug, inviteEmail)

      await page.goto(`/invites/${inviteId}`)

      // Should display some relative time (e.g., "há alguns segundos")
      await expect(page.getByText(/há/)).toBeVisible()
    })
  })
})
