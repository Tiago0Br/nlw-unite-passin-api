import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            id: 'd9e1b57c-1710-475d-953a-b48ee2c296e5',
            title: 'Any title',
            slug: 'any-title',
            details: 'A cool event',
            maximumAttendees: 120
        }
    })
}

seed().then(() => {
    console.log('Database seeded!')
    prisma.$disconnect()
})