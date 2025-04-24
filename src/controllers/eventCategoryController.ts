import { FastifyReply, FastifyRequest } from "fastify";
import { eventCategoryService } from "../services/eventCategoryService.js";
import { handleError } from "../utils/handlers/handleError.js";
import { EventCategory } from "@prisma/client";

export async function createEventCategoryRoute(
  request: FastifyRequest<{ Body: Omit<EventCategory, "categoryId" | "createdAt"> }>,
  reply: FastifyReply
) {
  try {
    const newEventCategory = await eventCategoryService.createEventCategory(
      request.body
    );
    return reply.status(201).send(newEventCategory);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function listEventCategoryRoute(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const eventCategories = await eventCategoryService.listEventCategory();
    return reply.status(200).send(eventCategories);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getEventCategoryByIdRoute(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const eventCategory = await eventCategoryService.getEventCategoryById(
      request.params.id
    );
    return reply.status(200).send(eventCategory);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteEventCategoryRoute(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    await eventCategoryService.deleteEventCategory(request.params.id);
    return reply
      .status(200)
      .send({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateEventCategoryRoute(
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<EventCategory>;
  }>,
  reply: FastifyReply
) {
  try {
    const updatedCategory = await eventCategoryService.updateEventCategory(
      request.params.id,
      request.body
    );
    return reply
      .status(200)
      .send({ message: "Categoria atualizada com sucesso", updatedCategory });
  } catch (error) {
    handleError(error, reply);
  }
}
