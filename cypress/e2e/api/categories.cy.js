/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Categorias de Eventos - ", () => {
  const mockBody = {
    categoryName: faker.person.fullName(),
    categoryDescription: faker.lorem.sentence(),
  };

  before(() => {
    cy.loginAsAdmin();
    cy.createUser();
  });

  describe("Cadastrar", () => {
    it("com token de admin - Deve retornar 201", () => {
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
        Cypress.env("categoryRecentCadastre", res.body);
      });
    });

    it("com token de usuário comum - Deve retornar 403", () => {
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

    it("com nome já cadastrado - Deve retornar 409", () => {
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
  });

  describe("Consultar", () => {
    it("listagem de categorias - Deve retornar 200", () => {
      cy.api({
        method: "GET",
        url: "/events-categories",
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("categoria existente - Deve retornar 200", () => {
      cy.api({
        method: "GET",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("categoria inexistente - Deve retornar 404", () => {
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

    it("categoria com ID inválido - Deve retornar 400", () => {
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
  });

  describe("Atualizar categoria", () => {
    it("com nome já cadastrado - Deve retornar 409", () => {
      cy.api({
        method: "PUT",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: Cypress.env("categoryRecentCadastre").categoryName,
          categoryDescription: "Nova descrição após update",
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message.toLowerCase()).to.include(
          "esta categoria já está cadastrada"
        );
      });
    });

    it("com nome e descrição válidos - Deve retornar 200", () => {
      const categoryName = faker.lorem.words(3)
      cy.api({
        method: "PUT",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: categoryName,
          categoryDescription: "Nova descrição após update",
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.updatedCategory.categoryName).to.eq(categoryName);
      });
    });

    it("com nome vazio - Deve retornar 400 ", () => {
      cy.api({
        method: "PUT",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: "",
          categoryDescription: "Desc válida",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "não pode estar vazio"
        );
      });
    });

    it("com nome numérico - Deve retornar 400 ", () => {
      cy.api({
        method: "PUT",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: 12345,
          categoryDescription: "Desc válida",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "deve ser uma string"
        );
      });
    });

    it("inexistente - Deve retornar 404", () => {
      cy.api({
        method: "PUT",
        url: "/events-categories/c8be4e1c-5930-4fbb-885c-ebb0aa6ddbcf",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: "Teste",
          categoryDescription: "Teste",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.message.toLowerCase()).to.include(
          "categoria de evento não encontrada"
        );
      });
    });

    it("ID inválido - Deve retornar 400 ", () => {
      cy.api({
        method: "PUT",
        url: "/events-categories/id-invalido",
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
        body: {
          categoryName: "Nome",
          categoryDescription: "Desc",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message.toLowerCase()).to.include(
          "id deve estar no formato de uuid v4"
        );
      });
    });

    it("usando token de usuário comum - Deve retornar 403", () => {
      cy.api({
        method: "PUT",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("userToken")}`,
        },
        body: {
          categoryName: "Categoria Bloqueada",
          categoryDescription: "Tentativa inválida",
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

  describe("Deletar categoria", () => {
    it("existente - Deve retornar 200", () => {
      cy.api({
        method: "DELETE",
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
        headers: {
          Authorization: `Bearer ${Cypress.env("adminToken")}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it("inexistente - Deve retornar 404", () => {
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

    it("com ID inválido - Deve retornar 400", () => {
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
});
