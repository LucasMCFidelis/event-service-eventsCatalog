import { eventCategoryService } from "../../services/eventCategoryService.js";
import { prisma } from "./prisma.js";

async function seedEventCategories() {
  console.log("Iniciando seedEventCategories...");

  try {
    const existingCategories = await prisma.eventCategory.findFirst();
    if (existingCategories) {
      console.log("Categorias já foram criadas.");
      return;
    }

    const eventCategories = [
      { categoryName: "Turísticos", categoryDescription: "Categoria do tipo turísticos" },
      { categoryName: "Religiosos", categoryDescription: "Categoria do tipo religiosos" },
      { categoryName: "Culturais", categoryDescription: "Categoria do tipo culturais" },
      { categoryName: "De lazer", categoryDescription: "Categoria do tipo de lazer" },
      { categoryName: "Desportivos", categoryDescription: "Categoria do tipo desportivos" },
      { categoryName: "Artísticos", categoryDescription: "Categoria do tipo artísticos" },
      { categoryName: "Cívicos", categoryDescription: "Categoria do tipo cívicos" },
      { categoryName: "Científicos", categoryDescription: "Categoria do tipo científicos" },
      { categoryName: "Promocionais", categoryDescription: "Categoria do tipo promocionais" },
    ];

    for (const category of eventCategories) {
      try {
        await eventCategoryService.createEventCategory(category);
        console.log(`Categoria "${category.categoryName}" criada.`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Erro ao criar categoria "${category.categoryName}":`, error.message);
        } else {
          console.error(`Erro desconhecido ao criar categoria "${category.categoryName}".`);
        }
      }
    }

    console.log("Categorias de evento criadas com sucesso!");
  } catch (error: any) {
    console.error("Erro ao executar seedEventCategories:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEventCategories();
