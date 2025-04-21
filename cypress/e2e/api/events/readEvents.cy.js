/// <reference types="cypress" />

describe("Buscar evento por ID", () => {
  let eventId;

  before(() => {
    cy.loginAsAdmin();
    cy.createUser();

    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      eventId = res.body.eventId;
    });
  });

  it("ao listar - Deve retornar 200", () => {
    cy.api("/events").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  it("existente - Deve retornar 200", () => {
    cy.api(`/events/${eventId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.eventId).to.eq(eventId);
    });
  });

  it("inexistente - Deve retornar 404", () => {
    cy.api({
      url: "/events/58187a40-2978-4777-80d3-05f16a12323a",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "evento não encontrado"
      );
    });
  });

  it("inválido - Deve retornar 400 ", () => {
    cy.api({
      url: "/events/id-invalido",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });
});
