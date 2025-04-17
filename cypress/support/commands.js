import { faker } from "@faker-js/faker";

// Função para gerar um endereço dentro de João Pessoa
function generateJoaoPessoaAddress() {
  const addressMap = [
    { street: "Rua João Teixeira", neighborhood: "Centro" },
    { street: "Avenida Epitácio Pessoa", neighborhood: "Tambaú" },
    { street: "Rua das Trincheiras", neighborhood: "Centro" },
    { street: "Rua Dom Pedro II", neighborhood: "Centro" },
    {
      street: "Avenida Governador Flávio Ribeiro Coutinho",
      neighborhood: "Manaíra",
    },
    { street: "Rua Princesa Isabel", neighborhood: "Centro" },
    { street: "Rua Monteiro Lobato", neighborhood: "Tambaú" },
    { street: "Rua José Américo", neighborhood: "Tambauzinho" },
    { street: "Avenida Rio Branco", neighborhood: "Centro" },
    { street: "Rua da Areia", neighborhood: "Centro" },
    { street: "Avenida Cabo Branco", neighborhood: "Cabo Branco" },
  ];

  const randomAddress = faker.helpers.arrayElement(addressMap);

  const randomNumber = faker.number.int({ min: 1, max: 500 }).toString();

  return {
    eventAddressStreet: randomAddress.street,
    eventAddressNumber: randomNumber,
    eventAddressNeighborhood: randomAddress.neighborhood,
  };
}

Cypress.Commands.add("fillEventForm", (eventData = {}) => {
  // Gerar data de início (agora ou no futuro)
  const startDate = eventData.hasOwnProperty("startDateTime")
    ? eventData.startDateTime
    : faker.date.future();

  // Garantir que a data de término seja após a de início (ex: +1h)
  const endDate = eventData.hasOwnProperty("endDateTime")
    ? eventData.endDateTime
    : new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

  const validData = {
    eventTitle: eventData.hasOwnProperty("eventTitle")
      ? eventData.eventTitle
      : faker.lorem.words(3),

    eventDescription: eventData.hasOwnProperty("eventDescription")
      ? eventData.eventDescription
      : faker.lorem.paragraph(),

    eventLink: eventData.hasOwnProperty("eventLink")
      ? eventData.eventLink
      : faker.internet.url(),

    eventPrice: eventData.hasOwnProperty("eventPrice")
      ? eventData.eventPrice
      : faker.number.int({ min: 0, max: 9999 }),

    eventAccessibilityLevel: eventData.hasOwnProperty("eventAccessibilityLevel")
      ? eventData.eventAccessibilityLevel
      : "ACESSIBILIDADE_BASICA",

    startDateTime: startDate,

    endDateTime: endDate,

    eventCategoryId: eventData.hasOwnProperty("eventCategoryId")
      ? eventData.eventCategoryId
      : "223decff-cca9-4990-a083-c30165607f3b",

    eventOrganizerId: eventData.hasOwnProperty("eventOrganizerId")
      ? eventData.eventOrganizerId
      : "58187a40-2978-4777-80d3-05f16a12323a",
  };

  const address = generateJoaoPessoaAddress();

  const finalAddress = {
    eventAddressStreet: eventData.hasOwnProperty("eventAddressStreet")
      ? eventData.eventAddressStreet
      : address.eventAddressStreet,

    eventAddressNumber: eventData.hasOwnProperty("eventAddressNumber")
      ? eventData.eventAddressNumber
      : address.eventAddressNumber,

    eventAddressNeighborhood: eventData.hasOwnProperty(
      "eventAddressNeighborhood"
    )
      ? eventData.eventAddressNeighborhood
      : address.eventAddressNeighborhood,

    eventAddressComplement: eventData.hasOwnProperty("eventAddressComplement")
      ? eventData.eventAddressComplement
      : address.eventAddressComplement,
  };

  const finalData = { ...validData, ...finalAddress };

  // Envio dos dados para a API
  return cy.api({
    method: "POST",
    url: "/events",
    headers: {
      Authorization: `Bearer ${Cypress.env("adminToken")}`,
    },
    body: finalData,
    failOnStatusCode: false,
  });
});
