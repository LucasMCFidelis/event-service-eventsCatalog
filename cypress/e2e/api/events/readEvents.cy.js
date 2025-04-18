/// <reference types="cypress" />

describe.only("Buscar evento por ID", () => {
  let eventId;

  before(() => {
    cy.loginAsAdmin()
    cy.createUser()

    cy.fillEventForm().then((res) => {
      expect(res.status).to.eq(201);
      eventId = res.body.eventId;
    });
  });

  it("Deve retornar 200 ao listar eventos", () => {
    cy.api("/events").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array"); 
      expect(res.body.length).to.be.greaterThan(0); 
    });
  });

  it("Deve retornar 200 ao buscar evento existente", () => {
    cy.api(`/events/${eventId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.eventId).to.eq(eventId);
    });
  });

  it("Deve retornar 404 ao buscar evento inexistente", () => {
    cy.api("/events/58187a40-2978-4777-80d3-05f16a12323a", {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message.toLowerCase()).to.include(
        "evento não encontrado"
      );
    });
  });

  it("Deve retornar 400 quando o ID estiver em formato inválido", () => {
    cy.api("/events/id-invalido", { failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.include(
        "id deve estar no formato de uuid v4"
      );
    });
  });
});
