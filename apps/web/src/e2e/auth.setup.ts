import path from 'node:path'
import { test as setup } from '@playwright/test'

const authFileAdmin = path.join(
  __dirname,
  '../../../../playwright/.auth/admin.json'
)
const authFileMember = path.join(
  __dirname,
  '../../../../playwright/.auth/member.json'
)

setup('authenticate as ADMIN', async ({ page }) => {
  await page.goto('/sign-in')

  await page.getByLabel(/email/i).fill('bruce@email.com')
  await page.getByLabel(/^senha$/i).fill('123456')

  const submitButton = page.getByRole('button', { name: /^entrar$/i })
  await submitButton.click()

  await page.waitForURL('/')

  await page.context().storageState({ path: authFileAdmin })
})

setup('authenticate as MEMBER', async ({ page }) => {
  await page.goto('/sign-in')

  await page.getByLabel(/email/i).fill('clark@email.com')
  await page.getByLabel(/^senha$/i).fill('123456')

  const submitButton = page.getByRole('button', { name: /^entrar$/i })
  await submitButton.click()

  await page.waitForURL('/')

  await page.context().storageState({ path: authFileMember })
})
