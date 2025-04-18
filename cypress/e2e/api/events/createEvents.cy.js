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
  it("Deve retornar 400 quando não informar o título (campo obrigatório)", () => {
    cy.fillEventForm({
      eventTitle: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("título é obrigatório");
    });
  });

  it("Deve retornar 400 quando o título for vazio", () => {
    cy.fillEventForm({ eventTitle: "" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("título não pode estar vazio");
    });
  });

  it("Deve retornar 400 quando o título conter apenas espaços em branco", () => {
    cy.fillEventForm({ eventTitle: "     " }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve conter no mínimo 3 caracteres");
    });
  });

  it("Deve retornar 400 quando o título tiver menos de 3 caracteres", () => {
    cy.fillEventForm({ eventTitle: "ab" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve conter no mínimo 3 caracteres");
    });
  });

  it("Deve retornar 400 quando o título tiver mais de 120 caracteres", () => {
    const longTitle = "A".repeat(121);
    cy.fillEventForm({ eventTitle: longTitle }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "deve conter no máximo 120 caracteres"
      );
    });
  });

  it("Deve retornar 400 quando o título for um número", () => {
    cy.fillEventForm({ eventTitle: 123456 }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("deve ser uma string");
    });
  });
});

describe("Descrição", () => {
  it("Deve aceitar sem informar a descrição (campo opcional)", () => {
    cy.fillEventForm({
      eventDescription: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 400 quando a descrição estiver vazia", () => {
    cy.fillEventForm({
      eventDescription: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("descrição não pode estar vazia");
    });
  });

  it("Deve retornar 400 quando a descrição conter apenas espaços", () => {
    cy.fillEventForm({
      eventDescription: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no mínimo 3 caracteres"
      );
    });
  });

  it("Deve retornar 400 quando a descrição for um número", () => {
    cy.fillEventForm({
      eventDescription: 123456,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("descrição deve ser uma string");
    });
  });

  it("Deve retornar 400 quando a descrição for menor que 3 caracteres", () => {
    cy.fillEventForm({
      eventDescription: "oi",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no mínimo 3 caracteres"
      );
    });
  });

  it("Deve retornar 400 quando a descrição for maior que 600 caracteres", () => {
    cy.fillEventForm({
      eventDescription: "a".repeat(601),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "descrição deve conter no máximo 600 caracteres"
      );
    });
  });

  it("Deve retornar 201 com uma descrição válida", () => {
    cy.fillEventForm({
      eventDescription: "Evento de teste com descrição válida.",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Link", () => {
  it("Deve aceitar sem informar o link (campo opcional)", () => {
    cy.fillEventForm({
      eventLink: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 400 quando o link não for uma string", () => {
    cy.fillEventForm({
      eventLink: 123456,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma string");
    });
  });

  it("Deve retornar 400 quando o link for um texto que não é uma URL", () => {
    cy.fillEventForm({
      eventLink: "isso_nao_e_um_link",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma url válida");
    });
  });

  it("Deve retornar 400 quando o link for vazio", () => {
    cy.fillEventForm({
      eventLink: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link não pode estar vazio");
    });
  });

  it("Deve retornar 400 quando o link conter apenas espaços em branco", () => {
    cy.fillEventForm({
      eventLink: "     ",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("link deve ser uma url válida");
    });
  });

  it("Deve retornar 400 quando o link for maior que 255 caracteres", () => {
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

  it("Deve retornar 201 com um link válido", () => {
    cy.fillEventForm({
      eventLink: "https://meuevento.com/pagina",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Preço", () => {
  it("Deve retornar 400 quando não informar o preço (campo obrigatório)", () => {
    cy.fillEventForm({
      eventPrice: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço é obrigatório");
    });
  });

  it("Deve retornar 400 quando o preço for um texto", () => {
    cy.fillEventForm({
      eventPrice: "gratuito",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço deve ser um número");
    });
  });

  it("Deve retornar 400 quando o preço for negativo", () => {
    cy.fillEventForm({
      eventPrice: -5,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço não pode ser negativo");
    });
  });

  it('Deve retornar 400 quando o preço for uma string numérica com símbolo (ex: "R$10")', () => {
    cy.fillEventForm({
      eventPrice: "R$10",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("preço deve ser um número");
    });
  });

  it("Deve aceitar preço igual a 0 (evento gratuito)", () => {
    cy.fillEventForm({
      eventPrice: 0,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve aceitar um valor válido com casas decimais (ex: 15.50)", () => {
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

  it("Deve retornar 400 quando não informar a rua (campo obrigatório)", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("rua é obrigatória");
    });
  });

  it("Deve retornar 400 quando o nome da rua for vazio", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressStreet: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("rua não pode estar vazia");
    });
  });

  it("Deve retornar 400 quando o nome da rua conter apenas espaços em branco", () => {
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

  it("Deve retornar 400 quando o nome da rua for menor que 10 caracteres", () => {
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

  it("Deve retornar 400 quando o nome da rua for maior que 120 caracteres", () => {
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

  it("Deve retornar 201 com um nome de rua válido", () => {
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

  it("Deve retornar 400 quando não informar o número (campo obrigatório)", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("número é obrigatório");
    });
  });

  it("Deve retornar 400 quando o número for vazio", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("número não pode estar vazio");
    });
  });

  it("Deve retornar 400 quando o número for negativo", () => {
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

  it("Deve retornar 400 quando o número for maior que 8 caracteres", () => {
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

  it('Deve aceitar número como texto numérico (ex: "101A")', () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNumber: "101A",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 201 com número válido", () => {
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

  it("Deve retornar 400 quando não informar o bairro (campo obrigatório)", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: undefined,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("bairro é obrigatório");
    });
  });

  it("Deve retornar 400 quando o bairro for vazio", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressNeighborhood: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("bairro não pode estar vazio");
    });
  });

  it("Deve retornar 400 quando o bairro conter apenas espaços", () => {
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

  it("Deve retornar 400 quando o bairro for menor que 5 caracteres", () => {
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

  it("Deve retornar 400 quando o bairro for maior que 35 caracteres", () => {
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

  it("Deve aceitar nomes de bairro válidos", () => {
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

  it("Deve retornar 400 quando o complemento for maior que 30 caracteres", () => {
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

  it("Deve aceitar sem informar o complemento (campo opcional)", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 400 quando o complemento for uma string vazia", () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("complemento não pode estar vazio");
    });
  });

  it('Deve aceitar complemento com valor comum como "Apto 101"', () => {
    cy.fillEventForm({
      ...enderecoValido,
      eventAddressComplement: "Apto 101",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve aceitar complemento contendo letras, números e símbolos comuns", () => {
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

  it("Deve retornar 400 quando as coordenadas estiverem fora de João Pessoa", () => {
    cy.fillEventForm(enderecoInvalido).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "as coordenadas do evento estão fora dos limites de joão pessoa"
      );
    });
  });

  it("Deve retornar 201 para um endereço dentro de João Pessoa", () => {
    cy.fillEventForm(enderecoValido).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Acessibilidade", () => {
  it("Deve retornar 400 quando o nível de acessibilidade for vazio", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "nível de acessibilidade inválido"
      );
    });
  });

  it("Deve aceitar quando o nível de acessibilidade não for informado (campo opcional)", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 400 quando o nível de acessibilidade for inválido", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "NIVEL_SUPER_ALTO",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "nível de acessibilidade inválido"
      );
    });
  });

  it("Deve aceitar o valor ACESSIBILIDADE_BASICA", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "ACESSIBILIDADE_BASICA",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve aceitar o valor ACESSIBILIDADE_COMPLETA", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "ACESSIBILIDADE_COMPLETA",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve aceitar o valor SEM_ACESSIBILIDADE", () => {
    cy.fillEventForm({
      eventAccessibilityLevel: "SEM_ACESSIBILIDADE",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Datas", () => {
  it("Deve retornar 400 quando não informar a data de início (campo obrigatório)", () => {
    cy.fillEventForm({
      startDateTime: undefined,
      endDateTime: faker.date.future(),
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("data de início é obrigatória");
    });
  });

  it("Deve retornar 400 quando a data de início estiver no passado", () => {
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

  it("Deve retornar 400 quando a data de início for inválida", () => {
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

  it("Deve retornar 400 quando a data de término for anterior à de início", () => {
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

  it("Deve aceitar sem informar a data de término (campo opcional)", () => {
    cy.fillEventForm({
      endDateTime: undefined,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Deve retornar 400 quando a data de término for inválida", () => {
    cy.fillEventForm({
      endDateTime: "31-02-2025",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include(
        "data de término deve ser válida"
      );
    });
  });

  it("Deve retornar 201 quando as datas forem válidas e coerentes", () => {
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

describe("Relacionamentos", () => {
  it("Deve retornar 400 quando o ID da categoria for um UUID inválido", () => {
    cy.fillEventForm({
      eventCategoryId: "categoria_invalida",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });

  it("Deve retornar 400 quando o ID da categoria for vazio", () => {
    cy.fillEventForm({
      eventCategoryId: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("id não pode ser vazio.");
    });
  });

  it("Deve retornar 404 quando o ID da categoria for válido mas não existir", () => {
    cy.fillEventForm({
      eventCategoryId: "c299648b-c26c-4ff7-af78-782aba466074",
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "categoria de evento não encontrada"
      );
    });
  });

  it("Deve retornar 400 quando o ID do organizador for um UUID inválido", () => {
    cy.fillEventForm({
      eventOrganizerId: "organizador_invalido",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });

  it("Deve retornar 400 quando o ID do organizador for vazio", () => {
    cy.fillEventForm({
      eventOrganizerId: "",
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include("id não pode ser vazio.");
    });
  });

  it("Deve retornar 404 quando o ID do organizador for válido mas não existir", () => {
    cy.fillEventForm({
      eventOrganizerId: "c299648b-c26c-4ff7-af78-782aba466074",
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "organizador de eventos não encontrado"
      );
    });
  });

  it("Deve retornar 201 com IDs de categoria e organizador válidos", () => {
    cy.fillEventForm({
      eventCategoryId: "223decff-cca9-4990-a083-c30165607f3b",
      eventOrganizerId: "58187a40-2978-4777-80d3-05f16a12323a",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });
});

describe("Cadastro geral", () => {
  it("Cadastro com todos os campos", () => {
    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("eventId");
    });
  });

  it("Cadastro com campos obrigatórios", () => {
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

  it("Cadastro usando token de usuário", () => {
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
