import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const getEventAttendees = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {
            schema: {
                summary: 'Get event attendees',
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                querystring: z.object({
                    pageIndex: z.string().nullish().default('0').transform(Number),
                    query: z.string().nullish()
                }),
                response: {
                    200: z.object({
                        attendees: z.object({
                            id: z.number().int().positive(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            checkedInAt: z.date().nullable()
                        }).array(),
                        total: z.number().int()
                    })
                }
            }
        }, async (req, res) => {
            const { eventId } = req.params
            const { pageIndex, query } = req.query

            const attendees = await prisma.attendee.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    checkIn: {
                        select: {
                            createdAt: true
                        },
                    },
                },
                where: {
                    eventId,
                    name: {
                        contains: query ? query : ''
                    }
                },
                take: 10,
                skip: pageIndex * 10,
                orderBy: {
                    createdAt: 'desc'
                }
            })

            const total = await prisma.attendee.count({
                where: {
                    eventId,
                    name: {
                        contains: query ? query : ''
                    }
                }
            })

            res.send({
                attendees: attendees.map(attendee => ({
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    createdAt: attendee.createdAt,
                    checkedInAt: attendee.checkIn?.createdAt ?? null
                })),
                total
            })
        })
}