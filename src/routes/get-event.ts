import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const getEvent = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: {
                summary: 'Get an event',
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            details: z.string().nullable(),
                            slug: z.string(),
                            maximumAttendees: z.number().nullable(),
                            attendeesAmount: z.number()
                        })
                    })
                }
            }
        }, async (req, res) => {
            const { eventId } = req.params

            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    _count: {
                        select: {
                            attendees: true
                        }
                    }
                }
            })

            if (!event) {
                throw new Error('Event not found!')
            }

            const formatedEvent = {
                ...event,
                attendeesAmount: event._count.attendees,
                _count: undefined
            }

            res.send({
                event: formatedEvent
            })
        })
}