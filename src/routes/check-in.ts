import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from '../errors/bad-request'

export const checkIn = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                summary: 'Check-in an event',
                tags: ['check-in'],
                params: z.object({
                    attendeeId: z.coerce.number().int().positive()
                }),
                response: {
                    201: z.object({
                        message: z.string()
                    })
                }
            }
        }, async (req, res) => {
            const { attendeeId } = req.params

            const attendeeCheckIn = await prisma.checkIn.findUnique({
                where: { attendeeId }
            })

            if (attendeeCheckIn) {
                throw new BadRequest('Attendee already checked in')
            }

            await prisma.checkIn.create({
                data: { attendeeId }
            })

            return res.status(201).send({
                message: 'Attendee checked succesfully!'
            })
        })
}