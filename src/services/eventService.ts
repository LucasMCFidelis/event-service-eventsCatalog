async function createEvent(data: any) {
  try {
    console.log(data);
    
  } catch (error) {
    console.error("Erro ao criar evento", error);
    throw {
      status: 500,
      message: "Erro interno ao criar evento",
      error: "Erro no servidor",
    };
  }

  return 
}

export const eventService = {
  createEvent
};
