import { EventOrganizer } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/handlers/handleError.js";
import { eventOrganizerService } from "../services/eventOrganizerService.js";

export async function createEventOrganizerRoute(
  request: FastifyRequest<{ Body: EventOrganizer }>,
  reply: FastifyReply
) {
  try {
    const eventOrganizer = await eventOrganizerService.createEventOrganizer(
      request.body
    );
    return reply.status(201).send(eventOrganizer);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function listEventOrganizerRoute(
  _: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const eventOrganizers = await eventOrganizerService.listEventOrganizers();
    return reply.status(200).send(eventOrganizers);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getEventOrganizerByIdRoute(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const eventOrganizers = await eventOrganizerService.getEventOrganizerById(
      request.params.id
    );
    return reply.status(200).send(eventOrganizers);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteEventOrganizerRoute(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    await eventOrganizerService.deleteEventOrganizer(request.params.id);
    return reply
      .status(200)
      .send({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateEventOrganizerRoute(
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<EventOrganizer>;
  }>,
  reply: FastifyReply
) {
  try {
    const updatedOrganizer = await eventOrganizerService.updateEventOrganizer(
      request.params.id,
      request.body
    );
    return reply
      .status(200)
      .send({ message: "Categoria atualizada com sucesso", updatedOrganizer });
  } catch (error) {
    handleError(error, reply);
  }
}
