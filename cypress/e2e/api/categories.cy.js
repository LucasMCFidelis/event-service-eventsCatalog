/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Categorias de Eventos", () => {
  const mockBody = {
    categoryName: faker.person.fullName(),
    categoryDescription: faker.lorem.sentence(),
  };

  before(() => {
    cy.loginAsAdmin();
    cy.createUser();
  });

  describe("Cadastrar categoria de evento", () => {
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
        Cypress.env("categoryRecentCadastre", res.body);
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
  });

  describe("Consultar categoria de evento", () => {
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
        url: `/events-categories/${
          Cypress.env("categoryRecentCadastre").categoryId
        }`,
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
  });

  describe("Atualizar categoria de evento", () => {
    it("Deve retornar 409 ao editar com nome de categoria já cadastrada", () => {
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

    it("Deve retornar 200 ao editar nome e descrição com sucesso", () => {
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

    it("Deve retornar 400 quando o nome estiver vazio", () => {
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

    it("Deve retornar 400 quando o nome for numérico", () => {
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

    it("Deve retornar 404 ao tentar editar categoria inexistente", () => {
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

    it("Deve retornar 400 quando o ID for inválido", () => {
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

    it("Deve retornar 403 ao tentar editar com token de usuário comum", () => {
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

  describe("Deletar categoria de evento", () => {
    it("Deletar categoria existente deve retornar 200", () => {
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
});
