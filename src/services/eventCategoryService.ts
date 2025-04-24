import { EventCategory } from "@prisma/client";
import { prisma } from "../utils/db/prisma.js";
import { schemaEventCategory } from "../schemas/schemaEventCategoryCadastre.js";
import { schemaId } from "../schemas/schemaId.js";
import { schemaEventCategoryUpdate } from "../schemas/schemaEventCategoryUpdate.js";

async function createEventCategory(
  data: Omit<EventCategory, "categoryId" | "createdAt">
) {
  const { categoryName, categoryDescription } = data;

  await schemaEventCategory.validateAsync({
    categoryName,
    categoryDescription,
  });

  await checkExistingEventCategory(categoryName);

  try {
    const newEventCategory = await prisma.eventCategory.create({
      data: {
        categoryName,
        categoryDescription,
      },
    });

    return newEventCategory;
  } catch (error) {
    console.error("Erro ao criar categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao criar categoria de evento",
      error: "Erro no servidor",
    };
  }
}

async function checkExistingEventCategory(categoryName: string) {
  await schemaEventCategory.validateAsync({
    categoryName,
  });

  let eventCategory;
  try {
    eventCategory = await prisma.eventCategory.findUnique({
      where: {
        categoryName,
      },
    });
  } catch (error) {
    console.error("Erro ao checar existência da categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao checar existência da categoria de evento",
      error: "Erro no servidor",
    };
  }

  if (eventCategory) {
    throw {
      status: 409,
      existingCategory: true,
      message: "Esta categoria já está cadastrada.",
      error: "Erro de Conflito",
    };
  }
}

async function listEventCategory() {
  try {
    const eventCategories = await prisma.eventCategory.findMany({
      orderBy: {
        categoryName: "asc",
      },
    });

    if (eventCategories.length > 0) {
      return eventCategories;
    } else {
      throw {
        status: 404,
        error: "Erro Not Found",
        message: "Nenhuma categoria de eventos encontrada",
      };
    }
  } catch (error) {
    console.error("Erro ao criar categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao consultar categorias de evento",
      error: "Erro no servidor",
    };
  }
}

async function getEventCategoryById(eventCategoryId: string) {
  await schemaId.validateAsync({ id: eventCategoryId });

  let eventCategory;
  try {
    eventCategory = await prisma.eventCategory.findUnique({
      where: { categoryId: eventCategoryId },
    });
  } catch (error) {
    console.error("Erro ao criar categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao consultar categorias de evento",
      error: "Erro no servidor",
    };
  }

  if (!eventCategory) {
    throw {
      status: 404,
      message: "Categoria de evento não encontrada",
      error: "Erro Not Found",
    };
  }

  return eventCategory;
}

async function deleteEventCategory(eventCategoryId: string) {
  await getEventCategoryById(eventCategoryId);

  try {
    await prisma.eventCategory.delete({
      where: { categoryId: eventCategoryId },
    });
  } catch (error) {
    console.error("Erro ao deletar categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao deletar categoria de evento",
      error: "Erro no servidor",
    };
  }
}

async function updateEventCategory(
  eventCategoryId: string,
  data: Partial<EventCategory>
) {
  await getEventCategoryById(eventCategoryId);

  const { categoryName, categoryDescription } = data;
  await schemaEventCategoryUpdate.validateAsync({
    categoryName,
    categoryDescription,
  });
  categoryName && await checkExistingEventCategory(categoryName);

  try {
    const updatedCategory = await prisma.eventCategory.update({
      where: { categoryId: eventCategoryId },
      data: {
        ...(categoryName && { categoryName }),
        ...(categoryDescription && { categoryDescription }),
      },
    });

    return updatedCategory
  } catch (error) {
    console.error("Erro ao atualizar categoria de evento", error);
    throw {
      status: 500,
      message: "Erro interno ao atualizar categoria de evento",
      error: "Erro no servidor",
    };
  }
}

export const eventCategoryService = {
  createEventCategory,
  listEventCategory,
  getEventCategoryById,
  deleteEventCategory,
  updateEventCategory
};
