/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const authServiceUrl = Cypress.env("AUTH_SERVICE_URL");
const userServiceUrl = Cypress.env("USER_SERVICE_URL");
const adminEmail = Cypress.env("ADMIN_EMAIL");
const adminPassword = Cypress.env("ADMIN_PASSWORD");

describe("Deletar evento", () => {
  let eventId;

  before(() => {
    cy.loginAsAdmin()
    cy.createUser()

    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      eventId = res.body.eventId;
    });
  });

  it("usando token de usuário comum - Deve retornar 403", () => {
    cy.api({
      method: "DELETE",
      url: `/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("userToken")}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(403);
      expect(res.body.message.toLowerCase()).include("permissão insuficiente");
    });
  });

  it("existente - Deve retornar 201", () => {
    cy.api({
      method: "DELETE",
      url: `/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  it("que já foi deletado - Deve retornar 404", () => {
    cy.api({
      method: "DELETE",
      url: `/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "evento não encontrado"
      );
    });
  });

  it("o ID for inválido", () => {
    cy.api({
      method: "DELETE",
      url: "/events/id-invalido",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4."
      );
    });
  });

  it("ID não informado - Deve retornar 400", () => {
    cy.api({
      method: "DELETE",
      url: "/events/",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id não pode ser vazio"
      );
    });
  });
});
