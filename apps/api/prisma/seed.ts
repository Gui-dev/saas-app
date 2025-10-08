import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'

import { PrismaClient } from './../src/generated/prisma'

const prisma = new PrismaClient()

export const seed = async () => {
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const user1 = await prisma.user.create({
    data: {
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      passwordHash: await hash('123456', 6),
      avatarUrl: 'https://github.com/BryceWayne.png',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Clark Kent',
      email: 'clark@email.com',
      passwordHash: await hash('123456', 6),
      avatarUrl: 'https://github.com/ClarkKent.png',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Diana Prince',
      email: 'diana@email.com',
      passwordHash: await hash('123456', 6),
      avatarUrl: 'https://github.com/DianaPrince.png',
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Wayne Enterprises',
      ownerId: user1.id,
      slug: 'wayne-enterprises',
      domain: 'wayneenterprises.com',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      projects: {
        createMany: {
          data: [
            {
              name: 'Wayne Industries',
              description: faker.lorem.sentence(),
              slug: 'wayne-industries',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Wayne Incorporated',
              description: faker.lorem.sentence(),
              slug: 'wayne-incorporated',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Wayne Enterprises',
              description: faker.lorem.sentence(),
              slug: 'wayne-enterprises',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'ADMIN',
            },
            {
              userId: user2.id,
              role: 'MEMBER',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Daily Planet',
      ownerId: user1.id,
      slug: 'daily-planet',
      domain: 'dailyplanet.com',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      projects: {
        createMany: {
          data: [
            {
              name: 'Daily Planet Inc.',
              description: faker.lorem.sentence(),
              slug: 'daily-planet-inc',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Daily Planet LLC',
              description: faker.lorem.sentence(),
              slug: 'daily-planet-llc',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Daily Planet Corp.',
              description: faker.lorem.sentence(),
              slug: 'daily-planet-corp',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'MEMBER',
            },
            {
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Billing Company',
      ownerId: user1.id,
      slug: 'billing-company',
      domain: 'billingcompany.com',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      projects: {
        createMany: {
          data: [
            {
              name: 'Billing Company Inc.',
              description: faker.lorem.sentence(),
              slug: 'billing-company-inc',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Billing Company LLC',
              description: faker.lorem.sentence(),
              slug: 'billing-company-llc',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: 'Billing Company Corp.',
              description: faker.lorem.sentence(),
              slug: 'billing-company-corp',
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'BILLING',
            },
            {
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed()
  .then(async () => {
    console.log('Database has been seeded')
  })
  .finally(() => prisma.$disconnect())
