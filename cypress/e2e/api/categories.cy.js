/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe("Categorias de Eventos", () => {
  const authServiceUrl = Cypress.env("AUTH_SERVICE_URL");
  const userServiceUrl = Cypress.env("USER_SERVICE_URL");
  const adminEmail = Cypress.env("ADMIN_EMAIL");
  const adminPassword = Cypress.env("ADMIN_PASSWORD");

  const mockBody = {
    categoryName: faker.person.fullName(),
    categoryDescription: faker.lorem.sentence(),
  };

  before(() => {
    // Login Admin
    cy.api({
      method: "POST",
      url: `${authServiceUrl}/login`,
      body: {
        userEmail: adminEmail,
        passwordProvided: adminPassword,
      }
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
      }
    }).then((res) => {
      expect(res.status).to.eq(201)
      Cypress.env("userToken", res.body.userToken)
    })
  })

  it("Cadastro com token de admin deve retornar 201", () => {
    cy.api({
      method: "POST",
      url: "/events-categories",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      body: mockBody,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("categoryId");
      Cypress.env("categoryRecentCadastre", res.body)
    });
  });

  it("Cadastro com token de usuário comum deve retornar 403", () => {
    cy.api({
      method: "POST",
      url: "/events-categories",
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

  it("Cadastro com nome já cadastrado deve retornar 409", () => {
    cy.api({
      method: "POST",
      url: "/events-categories",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      body: { ...mockBody, categoryName: "teste 3" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(409);
      expect(res.body).to.have.property("message");
      expect(res.body.message.toLowerCase()).to.include(
        "esta categoria já está cadastrada"
      );
    });
  });

  it("Listar categorias deve retornar 200", () => {
    cy.api({
      method: "GET",
      url: "/events-categories",
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("Buscar categoria existente deve retornar 200", () => {
    cy.api({
      method: "GET",
      url: `/events-categories/${Cypress.env("categoryRecentCadastre").categoryId}`,
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("Buscar categoria inexistente deve retornar 404", () => {
    cy.api({
      method: "GET",
      url: "/events-categories/58187a40-4444-4777-80d3-05f16a44423a",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property("message");
      expect(res.body.message.toLowerCase()).to.include(
        "categoria de evento não encontrada"
      );
    });
  });

  it("Buscar categoria com ID inválido deve retornar 400", () => {
    cy.api({
      method: "GET",
      url: "/events-categories/a12323a",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property("message");
      expect(res.body.message.toLowerCase()).to.include(
        "o id deve estar no formato de uuid v4"
      );
    });
  });

  it("Deletar categoria existente deve retornar 200", () => {
    cy.api({
      method: "DELETE",
      url: `/events-categories/${Cypress.env("categoryRecentCadastre").categoryId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("Deletar categoria inexistente deve retornar 404", () => {
    cy.api({
      method: "DELETE",
      url: "/events-categories/c8be4e1c-5930-4fbb-885c-ebb0aa6ddbcf",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property("message");
      expect(res.body.message.toLowerCase()).to.include(
        "categoria de evento não encontrada"
      );
    });
  });

  it("Deletar categoria com ID inválido deve retornar 400", () => {
    cy.api({
      method: "DELETE",
      url: "/events-categories/c8be4",
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
