/// <reference types="cypress" />

describe("Editar evento", () => {
  let eventId;

  before(() => {
    cy.loginAsAdmin()
    cy.createUser()

    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      eventId = res.body.eventId;
    });
  });

  it("com dados válidos - Deve retornar 200", () => {
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

  it("inexistente - Deve retornar 404", () => {
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

  it("com título inválido - Deve retornar 400", () => {
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
