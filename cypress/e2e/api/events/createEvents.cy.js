/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const authServiceUrl = Cypress.env("AUTH_SERVICE_URL");
const userServiceUrl = Cypress.env("USER_SERVICE_URL");
const adminEmail = Cypress.env("ADMIN_EMAIL");
const adminPassword = Cypress.env("ADMIN_PASSWORD");

before(() => {
  cy.loginAsAdmin()
    cy.createUser()
});

describe("Título", () => {
  it("não for informado (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      eventTitle: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("título é obrigatório");
    });
  });

  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({ eventTitle: "" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("título não pode estar vazio");
    });
  });

  it("conter apenas espaços - Deve retornar 400", () => {
    cy.fillEventForm({ eventTitle: "     " }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve conter no mínimo 3 caracteres");
    });
  });

  it("menor que 3 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({ eventTitle: "ab" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve conter no mínimo 3 caracteres");
    });
  });

  it("maior que 120 caracteres - Deve retornar 400", () => {
    const longTitle = "A".repeat(121);
    cy.fillEventForm({ eventTitle: longTitle }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "deve conter no máximo 120 caracteres"
      );
    });
  });

  it("um número - Deve retornar 400", () => {
    cy.fillEventForm({ eventTitle: 123456 }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve ser uma string");
    });
  });
});

describe("Descrição", () => {
  it("não for informada (campo opcional) - Deve ser aceito", () => {
    cy.fillEventForm({
      eventDescription: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("estiver vazia - Deve retornar 400", () => {
    cy.fillEventForm({
      eventDescription: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("descrição não pode estar vazia");
    });
  });

  it("conter apenas espaços - Deve retornar 400", () => {
    cy.fillEventForm({
      eventDescription: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no mínimo 3 caracteres"
      );
    });
  });

  it("um número - Deve retornar 400", () => {
    cy.fillEventForm({
      eventDescription: 123456,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("descrição deve ser uma string");
    });
  });

  it("menor que 3 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      eventDescription: "oi",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no mínimo 3 caracteres"
      );
    });
  });

  it("maior que 600 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      eventDescription: "a".repeat(601),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no máximo 600 caracteres"
      );
    });
  });

  it("válida - Deve retornar 201", () => {
    cy.fillEventForm({
      eventDescription: "Evento de teste com descrição válida.",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Link", () => {
  it("não for informado (campo opcional) - Deve ser aceito", () => {
    cy.fillEventForm({
      eventLink: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("não for uma string - Deve retornar 400", () => {
    cy.fillEventForm({
      eventLink: 123456,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma string");
    });
  });

  it("não for uma URL válida - Deve retornar 400", () => {
    cy.fillEventForm({
      eventLink: "isso_nao_e_um_link",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma url válida");
    });
  });

  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      eventLink: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link não pode estar vazio");
    });
  });

  it("conter apenas espaços - Deve retornar 400", () => {
    cy.fillEventForm({
      eventLink: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma url válida");
    });
  });

  it("maior que 255 caracteres - Deve retornar 400", () => {
    const bigURL = `https://meusite.com/${"muito-comprido/".repeat(20)}`;
    cy.fillEventForm({
      eventLink: bigURL,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "link deve conter no máximo 255 caracteres"
      );
    });
  });

  it("válido - Deve retornar 201", () => {
    cy.fillEventForm({
      eventLink: "https://meuevento.com/pagina",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Preço", () => {
  it("não for informado (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      eventPrice: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço é obrigatório");
    });
  });

  it("um texto - Deve retornar 400", () => {
    cy.fillEventForm({
      eventPrice: "gratuito",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço deve ser um número");
    });
  });

  it("negativo - Deve retornar 400", () => {
    cy.fillEventForm({
      eventPrice: -5,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço não pode ser negativo");
    });
  });

  it('como string com símbolo (ex: "R$10") - Deve retornar 400', () => {
    cy.fillEventForm({
      eventPrice: "R$10",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço deve ser um número");
    });
  });

  it("igual a 0 (evento gratuito) - Deve ser aceito", () => {
    cy.fillEventForm({
      eventPrice: 0,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("com casas decimais (ex: 15.50) - Deve ser aceito", () => {
    cy.fillEventForm({
      eventPrice: 15.5,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Nome da rua", () => {
  const enderecoValido = {
    eventAddressNumber: "123",
    eventAddressNeighborhood: "Centro",
  };

  it("não informado (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("rua é obrigatória");
    });
  });

  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("rua não pode estar vazia");
    });
  });

  it("conter apenas espaços - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "rua deve conter no mínimo 10 caracteres"
      );
    });
  });

  it("menor que 10 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: "AB",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "rua deve conter no mínimo 10 caracteres"
      );
    });
  });

  it("maior que 120 caracteres - Deve retornar 400", () => {
    const longStreet = "Rua ".concat("A".repeat(117));
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: longStreet,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "rua deve conter no máximo 120 caracteres"
      );
    });
  });

  it("válido - Deve retornar 201", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: "Rua Professora Maria das Dores Ferreira",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Número", () => {
  const enderecoValido = {
    eventAddressStreet: "Rua João Teixeira de Carvalho",
    eventAddressNeighborhood: "Centro",
  };

  it("não informado (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("número é obrigatório");
    });
  });

  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("número não pode estar vazio");
    });
  });

  it("negativo - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "-100",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "número aceita apenas caracteres alfanuméricos"
      );
    });
  });

  it("maior que 8 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "9".repeat(21),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "número deve conter no máximo 8 caracteres"
      );
    });
  });

  it('como texto numérico (ex: "101A") - Deve ser aceito', () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "101A",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("válido - Deve retornar 201", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "567",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Bairro", () => {
  const enderecoValido = {
    eventAddressStreet: "Rua Dom Pedro II",
    eventAddressNumber: "456",
  };

  it("não informado (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("bairro é obrigatório");
    });
  });

  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("bairro não pode estar vazio");
    });
  });

  it("conter apenas espaços - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "bairro deve conter no mínimo 5 caracteres"
      );
    });
  });

  it("menor que 5 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: "AB",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "bairro deve conter no mínimo 5 caracteres"
      );
    });
  });

  it("maior que 35 caracteres - Deve retornar 400", () => {
    const longNeighborhood = "Bairro ".concat("X".repeat(75));
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: longNeighborhood,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "bairro deve conter no máximo 35 caracteres"
      );
    });
  });

  it("válido - Deve ser aceito", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: "Tambauzinho",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Complemento", () => {
  const enderecoValido = {
    eventAddressStreet: "Rua Monteiro Lobato",
    eventAddressNumber: "789",
    eventAddressNeighborhood: "Manaíra",
  };

  it("maior que 30 caracteres - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "Complemento muito grande: ".concat(
        "X".repeat(10)
      ),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "complemento deve conter no máximo 30 caracteres"
      );
    });
  });

  it("não informado (campo opcional) - Deve ser aceito", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("como string vazia - Deve retornar 400", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("complemento não pode estar vazio");
    });
  });

  it('com valor comum "Apto 101" - Deve ser aceito', () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "Apto 101",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("contendo letras, números e símbolos comuns - Deve ser aceito", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "Bloco C - Fundos",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Coordenadas", () => {
  const enderecoInvalido = {
    eventAddressStreet: "Avenida Paulista", // fora de JP
    eventAddressNumber: "1000",
    eventAddressNeighborhood: "Bela Vista",
  };

  const enderecoValido = {
    eventAddressStreet: "Avenida Epitácio Pessoa",
    eventAddressNumber: "1200",
    eventAddressNeighborhood: "Tambaú",
  };

  it("fora de João Pessoa - Deve retornar 400", () => {
    cy.fillEventForm(enderecoInvalido).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "as coordenadas do evento estão fora dos limites de joão pessoa"
      );
    });
  });

  it("dentro de João Pessoa - Deve retornar 201", () => {
    cy.fillEventForm(enderecoValido).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Acessibilidade", () => {
  it("vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "nível de acessibilidade inválido"
      );
    });
  });

  it("não for informado (campo opcional) - Deve ser aceito", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("inválido - Deve retornar 400", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "NIVEL_SUPER_ALTO",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "nível de acessibilidade inválido"
      );
    });
  });

  it("ACESSIBILIDADE_BASICA - Deve ser aceito", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "ACESSIBILIDADE_BASICA",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("ACESSIBILIDADE_COMPLETA - Deve ser aceito", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "ACESSIBILIDADE_COMPLETA",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("SEM_ACESSIBILIDADE - Deve ser aceito", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "SEM_ACESSIBILIDADE",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Datas", () => {
  it("de início não informada (campo obrigatório) - Deve retornar 400", () => {
    cy.fillEventForm({
      startDateTime: undefined,
      endDateTime: faker.date.future(),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("data de início é obrigatória");
    });
  });

  it("de início estiver no passado - Deve retornar 400", () => {
    const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    cy.fillEventForm({
      startDateTime: ontem,
      endDateTime: faker.date.future(),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "data de início não pode ser anterior à data atual"
      );
    });
  });

  it("de início for inválida - Deve retornar 400", () => {
    cy.fillEventForm({
      startDateTime: "data_invalida",
      endDateTime: faker.date.future(),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "data de início deve ser válida"
      );
    });
  });

  it("de término for anterior à de início - Deve retornar 400", () => {
    const now = new Date();
    const start = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2h
    const end = new Date(now.getTime() + 1 * 60 * 60 * 1000); // +1h

    cy.fillEventForm({
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "data de término não pode ser menor que a data de início"
      );
    });
  });

  it("de término não informada(campo opcional) - Deve ser aceito", () => {
    cy.fillEventForm({
      endDateTime: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("de término for inválida - Deve retornar 400", () => {
    cy.fillEventForm({
      endDateTime: "31-02-2025",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "data de término deve ser válida"
      );
    });
  });

  it("válidas e coerentes - Deve retornar 201", () => {
    const start = new Date(Date.now() + 60 * 60 * 1000); // +1h
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h

    cy.fillEventForm({
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Relacionamentos - ", () => {
  it("ID da categoria inválido - Deve retornar 400", () => {
    cy.fillEventForm({
      eventCategoryId: "categoria_invalida",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });

  it("ID da categoria vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      eventCategoryId: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("id não pode ser vazio.");
    });
  });

  it("ID da categoria inexistente - Deve retornar 404", () => {
    cy.fillEventForm({
      eventCategoryId: "c299648b-c26c-4ff7-af78-782aba466074",
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "categoria de evento não encontrada"
      );
    });
  });

  it("ID do organizador inválido - Deve retornar 400", () => {
    cy.fillEventForm({
      eventOrganizerId: "organizador_invalido",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });

  it("ID do organizador vazio - Deve retornar 400", () => {
    cy.fillEventForm({
      eventOrganizerId: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("id não pode ser vazio.");
    });
  });

  it("ID do organizador inexistente - Deve retornar 404", () => {
    cy.fillEventForm({
      eventOrganizerId: "c299648b-c26c-4ff7-af78-782aba466074",
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "organizador de eventos não encontrado"
      );
    });
  });

  it("IDs de categoria e organizador válidos - Deve retornar 201", () => {
    cy.fillEventForm({
      eventCategoryId: "223decff-cca9-4990-a083-c30165607f3b",
      eventOrganizerId: "58187a40-2978-4777-80d3-05f16a12323a",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Cadastro", () => {
  it("todos os campos - Deve retornar 201", () => {
    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("campos obrigatórios - Deve retornar 201", () => {
    cy.fillEventForm({
      eventDescription: undefined,
      eventLink: undefined,
      eventAddressComplement: undefined,
      endDateTime: undefined,
      eventAccessibilityLevel: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("usando token de usuário - Deve retornar 403", () => {
    cy.api({
      method: "POST",
      url: "/events",
      headers: {
        Authorization: `Bearer ${Cypress.env("userToken")}`,
      },
      body: {
        eventTitle: faker.lorem.words(3),
        eventPrice: faker.number.int({ min: 0, max: 9999 }),
        startDateTime: faker.date.future(),
        eventAddressStreet: "Avenida Epitácio Pessoa",
        eventAddressNumber: faker.number.int({ min: 1, max: 500 }).toString(),
        eventAddressNeighborhood: "Tambaú",
        eventCategoryId: "223decff-cca9-4990-a083-c30165607f3b",
        eventOrganizerId: "58187a40-2978-4777-80d3-05f16a12323a",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(403);
      expect(res.body.message.toLowerCase()).to.include(
        "permissão insuficiente"
      );
    });
  });
});
