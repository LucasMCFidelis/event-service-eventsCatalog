/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const userServiceUrl = Cypress.env("USER_SERVICE_URL");

describe.only("Editar evento", () => {
  let eventId;

  before(() => {
    cy.loginAsAdmin()
    cy.createUser()

    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      eventId = res.body.eventId;
    });
  });

  it("Deve retornar 200 ao editar evento com dados válidos", () => {
    cy.api({
      method: "PUT",
      url: `/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      body: {
        eventTitle: "Novo Título Editado",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.updatedEvent.eventTitle).to.eq("Novo Título Editado");
    });
  });

  it("Deve retornar 404 ao tentar editar evento inexistente", () => {
    cy.api({
      method: "PUT",
      url: "/events/58187a40-2978-4777-80d3-05f16a12323a",
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      body: {
        eventTitle: "Evento Fantasma",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "evento não encontrado"
      );
    });
  });

  it("Deve retornar 400 ao editar com título inválido", () => {
    cy.api({
      method: "PUT",
      url: `/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("adminToken")}`,
      },
      body: {
        eventTitle: 12345,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message.toLowerCase()).to.include("deve ser uma string");
    });
  });
});
