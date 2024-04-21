import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { generateSlug } from '../utils/generate-slug'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { BadRequest } from '../errors/bad-request'

export const createEvent = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                summary: 'Create an event',
                tags: ['events'],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid()
                    })
                }
            }
        }, async (req, res) => {
            const body = req.body
            const slug = generateSlug(body.title)
            const data = { ...body, slug }

            const eventWithSameSlug = await prisma.event.findUnique({
                where: { slug }
            })

            if (eventWithSameSlug) {
                throw new BadRequest('Event with this slug already exists!')
            }

            const event = await prisma.event.create({ data })

            res.status(201).send({
                eventId: event.id
            })
        })
}