import { EventOrganizer } from "@prisma/client";
import { schemaEventOrganizer } from "../schemas/schemaEventOrganizerCadastre.js";
import { prisma } from "../utils/db/prisma.js";
import { schemaId } from "../schemas/schemaId.js";
import { schemaEventOrganizerUpdate } from "../schemas/schemaEventOrganizerUpdate.js";

async function checkExistingEventOrganizer(
  organizerEmail?: string,
  organizerCnpj?: string
) {
  let eventOrganizer;
  try {
    eventOrganizer = await prisma.eventOrganizer.findFirst({
      where: {
        OR: [{ organizerEmail }, { organizerCnpj }],
      },
    });
  } catch (error) {
    console.error("Erro ao checar existência do organizador de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao checar existência do organizador de evento",
      error: "Erro no servidor",
    };
  }

  if (eventOrganizer) {
    throw {
      status: 409,
      existingOrganizer: true,
      message: "Este organizador já está cadastrado",
      error: "Erro de Conflito",
    };
  }
}

async function createEventOrganizer(data: EventOrganizer) {
  await schemaEventOrganizer.validateAsync(data);
  const { organizerName, organizerEmail, organizerCnpj, organizerPhoneNumber } =
    data;

  await checkExistingEventOrganizer(organizerEmail, organizerCnpj);

  try {
    const newEventOrganizer = await prisma.eventOrganizer.create({
      data: {
        organizerName,
        organizerEmail,
        organizerCnpj,
        organizerPhoneNumber,
      },
    });

    return newEventOrganizer;
  } catch (error) {
    console.error("Erro ao criar organizador de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao criar organizador de evento",
      error: "Erro no servidor",
    };
  }
}

async function listEventOrganizers() {
  let eventOrganizers;
  try {
    eventOrganizers = await prisma.eventOrganizer.findMany({
      orderBy: {
        organizerName: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar organizadores de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao consultar organizadores de evento",
      error: "Erro no servidor",
    };
  }

  if (eventOrganizers.length > 0) {
    return eventOrganizers;
  } else {
    throw {
      status: 404,
      message: "Nenhum organizador de eventos foi encontrado",
      error: "Erro Not Found",
    };
  }
}

async function getEventOrganizerById(organizerId: string) {
  await schemaId.validateAsync({ id: organizerId });

  let eventOrganizer;
  try {
    eventOrganizer = await prisma.eventOrganizer.findUnique({
      where: { organizerId },
    });
  } catch (error) {
    console.error("Erro ao buscar organizador de eventos", error);
    throw {
      status: 500,
      message: "Erro interno ao buscar organizador de eventos",
      error: "Erro no servidor",
    };
  }

  if (!eventOrganizer) {
    throw {
      status: 404,
      message: "Organizador de eventos não encontrado",
      error: "Erro Not Found",
    };
  }

  return eventOrganizer;
}

async function deleteEventOrganizer(organizerId: string) {
  await getEventOrganizerById(organizerId);

  try {
    await prisma.eventOrganizer.delete({
      where: { organizerId },
    });
  } catch (error) {
    console.error("Erro ao excluir organizador de eventos", error);
    throw {
      status: 500,
      message: "Erro interno ao excluir organizador de eventos",
      error: "Erro no servidor",
    };
  }
}

async function updateEventOrganizer(
  organizerId: string,
  data: Partial<EventOrganizer>
) {
  await schemaEventOrganizerUpdate.validateAsync(data);
  const { organizerName, organizerEmail, organizerCnpj, organizerPhoneNumber } = data

  const organizer = await getEventOrganizerById(organizerId);

  if (
    organizerEmail !== organizer.organizerEmail ||
    organizerCnpj !== organizer.organizerCnpj
  ) {
    await checkExistingEventOrganizer(organizerEmail, organizerCnpj);
  }

  try {
    const updatedOrganizer = await prisma.eventOrganizer.update({
      where: { organizerId },
      data: {
        ...(organizerName && {organizerName}),
        ...(organizerEmail && {organizerEmail}),
        ...(organizerCnpj && {organizerCnpj}),
        ...(organizerPhoneNumber && {organizerPhoneNumber}),
      }
    });

    return updatedOrganizer
  } catch (error) {
    console.error("Erro ao atualizar organizador de eventos", error);
    throw {
      status: 500,
      message: "Erro interno ao atualizar organizador de eventos",
      error: "Erro no servidor",
    };
  }
}

export const eventOrganizerService = {
  createEventOrganizer,
  listEventOrganizers,
  getEventOrganizerById,
  deleteEventOrganizer,
  updateEventOrganizer,
};
