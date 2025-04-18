/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Organizadores de Eventos", () => {
  function formatCnpj(cnpj) {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  function formatPhone(phone) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
  }

  const mockBody = {
    organizerName: faker.company.name(),
    organizerCnpj: formatCnpj(faker.string.numeric(14)),
    organizerEmail: faker.internet.email(),
    organizerPhoneNumber: formatPhone(faker.string.numeric(11)),
  };

  before(() => {
    cy.loginAsAdmin();
    cy.createUser();
  });

  describe("Cadastrar organizador de evento", () => {
    it.only("Cadastro com token de admin deve retornar 201", () => {
      cy.api({
        method: "POST",
        url: "/events-organizers",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: mockBody,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property("organizerId");
        Cypress.env("organizerRecentCadastre", res.body);
      });
    });

    it("Cadastro com token de usuário comum deve retornar 403", () => {
      cy.api({
        method: "POST",
        url: "/events-organizers",
        headers: {
          Authorization: `Bearer ${Cypress.env("userToken")}`,
        },
        body: mockBody,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "permissão insuficiente"
        );
      });
    });

    it("Cadastro com CNPJ já cadastrado deve retornar 409", () => {
      cy.api({
        method: "POST",
        url: "/events-organizers",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: mockBody,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(409);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "este organizador já está cadastrado"
        );
      });
    });
  });

  describe("Consultar organizador de evento", () => {
    it("Listar organizadores deve retornar 200", () => {
      cy.api({
        method: "GET",
        url: "/events-organizers",
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("Buscar organizador existente deve retornar 200", () => {
      cy.api({
        method: "GET",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("Buscar organizador inexistente deve retornar 404", () => {
      cy.api({
        method: "GET",
        url: `/events-organizers/58187a40-4444-4777-80d3-05f16a44423a`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "organizador de eventos não encontrado"
        );
      });
    });

    it("Buscar organizador com ID inválido deve retornar 400", () => {
      cy.api({
        method: "GET",
        url: `/events-organizers/a12323a`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "o id deve estar no formato de uuid v4"
        );
      });
    });
  });

  describe.only("Atualizar organizador de evento", () => {
    it("Deve retornar 409 ao editar organizador com email já cadastrado", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: faker.company.name(),
          organizerEmail: Cypress.env("organizerRecentCadastre").organizerEmail,
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message.toLowerCase()).to.include(
          "este organizador já está cadastrado"
        );
      });
    });

    it("Deve retornar 409 ao editar organizador com CNPJ já cadastrado", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: faker.company.name(),
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message.toLowerCase()).to.include(
          "este organizador já está cadastrado"
        );
      });
    });

    it("Deve retornar 200 ao editar nome e e-mail com sucesso", () => {
      const organizerName = faker.company.name();
      const organizerEmail = faker.internet.email();

      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName,
          organizerEmail,
          organizerPhoneNumber: "(83)99999-0000",
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.updatedOrganizer.organizerName).to.eq(organizerName);
        expect(res.body.updatedOrganizer.organizerEmail).to.eq(organizerEmail);
      });
    });

    it("Deve retornar 400 quando o nome for numérico", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: 123456,
          organizerEmail: faker.internet.email(),
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "deve ser uma string"
        );
      });
    });

    it("Deve retornar 400 quando o e-mail for inválido", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: faker.company.name(),
          organizerEmail: "invalido.com",
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "deve ser um email válido"
        );
      });
    });

    it("Deve retornar 400 quando o CNPJ for inválido", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: faker.company.name(),
          organizerEmail: faker.internet.email(),
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: "12345678",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "deve estar no formato"
        );
      });
    });

    it("Deve retornar 404 ao tentar editar organizador inexistente", () => {
      cy.api({
        method: "PUT",
        url: "/events-organizers/f2dfeb27-6b70-44a7-9d3a-6ea0c5c044fd",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: "Inexistente",
          organizerEmail: "teste@empresa.com",
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.message.toLowerCase()).to.include(
          "organizador de eventos não encontrado"
        );
      });
    });

    it("Deve retornar 400 quando o ID for inválido", () => {
      cy.api({
        method: "PUT",
        url: "/events-organizers/id-invalido",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          organizerName: "Teste",
          organizerEmail: "teste@empresa.com",
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "id deve estar no formato de uuid v4"
        );
      });
    });

    it("Deve retornar 403 ao tentar editar com token de usuário comum", () => {
      cy.api({
        method: "PUT",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("userToken")}`,
        },
        body: {
          organizerName: "Sem permissão",
          organizerEmail: "sem@acesso.com",
          organizerPhoneNumber: "(83)99999-0000",
          organizerCnpj: Cypress.env("organizerRecentCadastre").organizerCnpj,
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

  describe("Deletar organizador de evento", () => {
    it("Deletar organizador existente deve retornar 200", () => {
      cy.api({
        method: "DELETE",
        url: `/events-organizers/${
          Cypress.env("organizerRecentCadastre").organizerId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("Deletar organizador inexistente deve retornar 404", () => {
      cy.api({
        method: "DELETE",
        url: `/events-organizers/c8be4e1c-5930-4fbb-885c-ebb0aa6ddbcf`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "organizador de eventos não encontrado"
        );
      });
    });

    it("Deletar organizador com ID inválido deve retornar 400", () => {
      cy.api({
        method: "DELETE",
        url: `/events-organizers/c8be4`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property("message");
        expect(res.body.message.toLowerCase()).to.include(
          "o id deve estar no formato de uuid v4"
        );
      });
    });
  });
});
