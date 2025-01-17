import { Event } from "@prisma/client";
import { schemaEvent } from "../schemas/schemaEventCadastre.js";
import { schemaId } from "../schemas/schemaId.js";
import { prisma } from "../utils/db/prisma.js";

async function createEvent(data: Event) {
  const { eventOrganizerId, eventCategoryId, ...dataEvent } = data;

  await Promise.all([
    schemaEvent.validateAsync(dataEvent),
    schemaId.validateAsync({ id: eventOrganizerId }),
    schemaId.validateAsync({ id: eventCategoryId }),
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

    return newEvent
  } catch (error) {
    console.error("Erro ao criar evento", error);
    throw {
      status: 500,
      message: "Erro interno ao criar evento",
      error: "Erro no servidor",
    };
  }
}

export const eventService = {
  createEvent,
};
