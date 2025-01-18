import { FastifyReply, FastifyRequest } from "fastify";
import { eventService } from "../services/eventService.js";
import { handleError } from "../utils/handlers/handleError.js";
import { Event } from "@prisma/client";

export async function createEventRoute(
  request: FastifyRequest<{ Body: Event }>,
  reply: FastifyReply
) {
  try {
    const event = await eventService.createEvent(request.body);
    return reply.status(201).send(event);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function listEventsRoute(_:FastifyRequest, reply: FastifyReply) {
  try {
    const events = await eventService.listEvents()
    return reply.status(200).send(events)
  } catch (error) {
    return handleError(error, reply)
  }
}

export async function getEventByIdRoute(request:FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
  try {
    const event = await eventService.getEventById(request.params.id)
    return reply.status(200).send(event)
  } catch (error) {
    handleError(error, reply)
  }
}
