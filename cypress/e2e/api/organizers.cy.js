/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Organizadores de Eventos", () => {
  const authServiceUrl = Cypress.env("AUTH_SERVICE_URL");
  const userServiceUrl = Cypress.env("USER_SERVICE_URL");
  const adminEmail = Cypress.env("ADMIN_EMAIL");
  const adminPassword = Cypress.env("ADMIN_PASSWORD");

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
    // Login Admin
    cy.api({
      method: "POST",
      url: `${authServiceUrl}/login`,
      body: {
        userEmail: adminEmail,
        passwordProvided: adminPassword,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      Cypress.env("adminToken", res.body.userToken);
    });

    // Login User
    cy.api({
      method: "POST",
      url: `${userServiceUrl}/users`,
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "user@123SS"
      },
    }).then((res) => {
      expect(res.status).to.eq(201);
      Cypress.env("userToken", res.body.userToken);
    });
  });

  it("Cadastro com token de admin deve retornar 201", () => {
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
      Cypress.env("organizerRecentCadastre", res.body)
      // Cypress.env("organizerRecentCadastreId", res.body.organizerId);
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
      url: `/events-organizers/${Cypress.env("organizerRecentCadastre").organizerId}`,
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

  it("Deletar organizador existente deve retornar 200", () => {
    cy.api({
      method: "DELETE",
      url: `/events-organizers/${Cypress.env("organizerRecentCadastre").organizerId}`,
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
