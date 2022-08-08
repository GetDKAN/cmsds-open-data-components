Cypress.Commands.add('testPageNotFound', () => {
  cy.findByRole("heading", {
    level: 1,
    name: "Error: Page not found",
  }).should("exist");
  cy.findByText("We're sorry, but there is no web page that matches your entry. You may have been directed here because:").should("exist");
  cy.get(".ds-l-container").findAllByRole("listitem").should("have.length", 3);
  cy.findByText("The address you typed contains a typo;").should("exist");
  cy.findByText("The requested page may have expired or;").should("exist");
  cy.findByText("The requested page may have been moved.").should("exist");
  cy.findByText("If you were using a bookmark, please reset it once you find the correct page.").should("exist");
});