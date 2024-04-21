import { FastifyInstance } from 'fastify'
import { BadRequest } from '../errors/bad-request'
import { ZodError } from 'zod'

export const errorHandler: FastifyInstance['errorHandler'] = (error, _, res) => {

    let status = 500

    if (error instanceof ZodError) {
        return res.status(400).send({
            message: 'Error during validation',
            errors: error.flatten().fieldErrors
        })
    }

    if (error instanceof BadRequest) status = 400

    return res.status(status).send({
        error: error.message
    })
}