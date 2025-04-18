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

  it("Tentar deletar um evento usando token de usuário", () => {
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

  it("Deve retornar 201 ao deletar um evento existente", () => {
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

  it("Deve retornar 404 ao tentar deletar um evento que já foi deletado", () => {
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

  it("Deve retornar 400 quando o ID for inválido", () => {
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

  it("Deve retornar 400 quando o ID não for informado", () => {
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
