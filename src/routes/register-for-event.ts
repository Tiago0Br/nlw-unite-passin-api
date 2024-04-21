import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const registerForEvent = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                summary: 'Register in an event',
                tags: ['attendees'],
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email()
                }),
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number()
                    })
                }
            }
        }, async (req, res) => {
            const { eventId } = req.params
            const { name, email } = req.body

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        email,
                        eventId
                    }
                }
            })

            if (attendeeFromEmail) {
                throw new Error('An attendee with this e-mail already exists on this event!')
            }

            const [event, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: { id: eventId }
                }),
                prisma.attendee.count({
                    where: { eventId }
                })
            ])

            if (!event) {
                throw new Error('Event not found!')
            }

            if (event.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
                throw new Error('This event not accept more attendees!')
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId
                }
            })

            res.send({
                attendeeId: attendee.id
            })
        })
}