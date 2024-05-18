import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const health = async (app: FastifyInstance) => {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/health', {
            schema: {
                response: {
                    200: z.object({
                        message: z.string()
                    })
                }
            }
        }, async (_, res) => {
            return res.status(200).send({ message: 'API is healthy!' })
        })
}