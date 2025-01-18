import { EventOrganizer } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/handlers/handleError.js";
import { eventOrganizerService } from "../services/eventOrganizerService.js";

export async function createEventOrganizerRoute(request:FastifyRequest<{Body: EventOrganizer}>, reply: FastifyReply) {
    try {
        const eventOrganizer = await eventOrganizerService.createEventOrganizer(request.body)
        return reply.status(201).send(eventOrganizer)
    } catch (error) {
        handleError(error, reply)
    }
}

export async function listEventOrganizerRoute(_:FastifyRequest, reply: FastifyReply) {
    try {
        const eventOrganizers = await eventOrganizerService.listEventOrganizers()
        return reply.status(200).send(eventOrganizers)
    } catch (error) {
        handleError(error, reply)
    }
}