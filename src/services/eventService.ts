import { Event } from "@prisma/client";
import { schemaEvent } from "../schemas/schemaEventCadastre.js";
import { prisma } from "../utils/db/prisma.js";
import { eventOrganizerService } from "./eventOrganizerService.js";
import { eventCategoryService } from "./eventCategoryService.js";
import { schemaId } from "../schemas/schemaId.js";
import { schemaEventUpdate } from "../schemas/schemaEventUpdate.js";
import { getCoordinates } from "../utils/getCoordinates.js";
import { formatterFullAddress } from "../utils/formatters/formatterFullAddress.js";
import { validateCoordinatesWithMapbox } from "../utils/validateCoordinatesWithMapbox.js";

async function createEvent(data: Event) {
  const { eventOrganizerId, eventCategoryId, ...dataEvent } = data;

  await Promise.all([
    schemaEvent.validateAsync(dataEvent),
    eventOrganizerService.getEventOrganizerById(eventOrganizerId),
    eventCategoryService.getEventCategoryById(eventCategoryId),
  ]);

  const fullAddress = formatterFullAddress({
    street: dataEvent.eventAddressStreet,
    number: dataEvent.eventAddressNumber,
    neighborhood: dataEvent.eventAddressNeighborhood,
    complement: dataEvent.eventAddressComplement,
  });

  const { latitude, longitude } = await getCoordinates(fullAddress);

  const validatedCoordinates = await validateCoordinatesWithMapbox(latitude, longitude);
  if (!validatedCoordinates) {
    throw {
      status: 400,
      message: "As coordenadas do evento estão fora dos limites de João Pessoa.",
      error: "Coordenadas inválidas",
    };
  }

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
        latitude,
        longitude,
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

  return event;
}

async function deleteEvent(eventId: string) {
  await getEventById(eventId);

  try {
    await prisma.event.delete({ where: { eventId } });
  } catch (error) {
    console.error("Erro ao deletar evento", error);
    throw {
      status: 500,
      message: "Erro interno ao deletar evento",
      error: "Erro no servidor",
    };
  }
}

async function updateEvent(eventId: string, data: Partial<Event>) {
  await schemaEventUpdate.validateAsync(data);
  const event = await getEventById(eventId);

  const fullAddress = formatterFullAddress({
    street: data.eventAddressStreet || "",
    number: data.eventAddressNumber || "",
    neighborhood: data.eventAddressNeighborhood || "",
    complement: data.eventAddressComplement,
  });
  const currentAddress = formatterFullAddress({
    street: event.eventAddressStreet,
    number: event.eventAddressNumber,
    neighborhood: event.eventAddressNeighborhood,
    complement: event.eventAddressComplement,
  });

  let latitude, longitude;
  if (fullAddress !== currentAddress) {
    const coordinates = await getCoordinates(fullAddress);
    latitude = coordinates.latitude;
    longitude = coordinates.longitude;
  }

  try {
    await prisma.event.update({
      where: { eventId },
      data: {
        ...(data.eventTitle && { eventTitle: data.eventTitle }),
        ...(data.eventDescription && {
          eventDescription: data.eventDescription,
        }),
        ...(data.eventLink && { eventLink: data.eventLink }),
        ...(data.eventPrice && { eventPrice: data.eventPrice }),
        ...(data.eventAddressStreet && {
          eventAddressStreet: data.eventAddressStreet,
        }),
        ...(data.eventAddressNumber && {
          eventAddressNumber: data.eventAddressNumber,
        }),
        ...(data.eventAddressNeighborhood && {
          eventAddressNeighborhood: data.eventAddressNeighborhood,
        }),
        ...(data.eventAddressComplement && {
          eventAddressComplement: data.eventAddressComplement,
        }),
        ...(data.eventAccessibilityLevel && {
          eventAccessibilityLevel: data.eventAccessibilityLevel,
        }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar evento", error);
    throw {
      status: 500,
      message: "Erro interno ao atualizar evento",
      error: "Erro no servidor",
    };
  }
}

export const eventService = {
  createEvent,
  listEvents,
  getEventById,
  deleteEvent,
  updateEvent,
};
