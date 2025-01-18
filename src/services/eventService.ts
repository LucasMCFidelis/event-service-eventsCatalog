import { Event } from "@prisma/client";
import { schemaEvent } from "../schemas/schemaEventCadastre.js";
import { prisma } from "../utils/db/prisma.js";
import { eventOrganizerService } from "./eventOrganizerService.js";
import { eventCategoryService } from "./eventCategoryService.js";
import { schemaId } from "../schemas/schemaId.js";

async function createEvent(data: Event) {
  const { eventOrganizerId, eventCategoryId, ...dataEvent } = data;

  await Promise.all([
    schemaEvent.validateAsync(dataEvent),
    eventOrganizerService.getEventOrganizerById(eventOrganizerId),
    eventCategoryService.getEventCategoryById(eventCategoryId),
  ]);

  try {
    const newEvent = await prisma.event.create({
      data: {
        eventTitle: dataEvent.eventTitle,
        eventDescription: dataEvent.eventDescription,
        eventLink: dataEvent.eventLink,
        eventPrice: dataEvent.eventPrice,
        eventAddressStreet: dataEvent.eventAddressStreet,
        eventAddressNumber: dataEvent.eventAddressNumber,
        eventAddressNeighborhood: dataEvent.eventAddressNeighborhood,
        eventAddressComplement: dataEvent.eventAddressComplement,
        eventAccessibilityLevel: dataEvent.eventAccessibilityLevel,
        startDateTime: dataEvent.startDateTime,
        endDateTime: dataEvent.endDateTime,
        eventCategoryId,
        eventOrganizerId,
      },
    });

    return newEvent;
  } catch (error) {
    console.error("Erro ao criar evento", error);
    throw {
      status: 500,
      message: "Erro interno ao criar evento",
      error: "Erro no servidor",
    };
  }
}

async function listEvents() {
  let events;
  try {
    events = await prisma.event.findMany({
      orderBy: {
        eventTitle: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar eventos", error);
    throw {
      status: 500,
      message: "Erro interno ao consultar eventos",
      error: "Erro no servidor",
    };
  }

  if (events.length > 0) {
    return events;
  } else {
    throw {
      status: 404,
      error: "Erro Not Found",
      message: "Nenhum evento foi encontrado",
    };
  }
}

async function getEventById(eventId: string) {
  await schemaId.validateAsync({ id: eventId });

  let event;
  try {
    event = await prisma.event.findUnique({ where: { eventId } });
  } catch (error) {
    console.error("Erro ao buscar eventos", error);
    throw {
      status: 500,
      message: "Erro interno ao buscar eventos",
      error: "Erro no servidor",
    };
  }

  if (!event) {
    throw {
      status: 404,
      message: "Evento não encontrado",
      error: "Erro Not Found",
    };
  }
}

export const eventService = {
  createEvent,
  listEvents,
  getEventById
};
