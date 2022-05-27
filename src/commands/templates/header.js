Cypress.Commands.add('testUSABanner', () => {
  const buttonText = 'Here’s how you know';
  cy.findByRole('img', { name: 'U.S. Flag' }).should('exist');
  cy.findByText('An official website of the United States government').should('exist');
  cy.findByRole('button', { name: buttonText }).should('exist');
  cy.findByText(/Official websites use .gov/i).should('not.be.visible');
  cy.findByText(/Secure .gov websites use HTTPS/i).should('not.be.visible');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-down').should('exist');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-up').should('not.exist');
  cy.findByRole('button', { name: buttonText }).click();
  cy.findByText(/Official websites use .gov/i).should('be.visible');
  cy.findByText(/Secure .gov websites use HTTPS/i).should('be.visible');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-down').should('not.exist');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-up').should('exist');
  cy.findByRole('button', { name: buttonText }).click();
  cy.findByText(/Official websites use .gov/i).should('not.be.visible');
  cy.findByText(/Secure .gov websites use HTTPS/i).should('not.be.visible');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-down').should('exist');
  cy.get('.ds-c-usa-banner__button .ds-c-icon--arrow-up').should('not.exist');
});

Cypress.Commands.add('desktopCMSHeader', (mainLink, tagline, cmsLinks) => {
  cy.viewport(1150, 720);
  cy.get('.dc-c-cmsheader').within((div) => {
    cy.findByRole('link', { name: mainLink.title }).should('have.attr', 'href', mainLink.url);
    cy.findByAltText(mainLink.altText).should('exist');
  });
  cy.findByText(tagline).should('exist');
  cmsLinks.forEach((link) => {
    cy.findByRole('link', { name: link.label }).should('have.attr', 'href', link.url);
  });
});

Cypress.Commands.add('tabletCMSHeader', (mainLink, tagline, cmsLinks) => {
  cy.viewport(720, 720);
  cy.get('.dc-c-cmsheader').within((div) => {
    cy.findByRole('link', { name: mainLink.title }).should('have.attr', 'href', mainLink.url);
    cy.findByAltText(mainLink.altText).should('exist');
  });
  cy.findByText(tagline).should('not.exist');
  cmsLinks.forEach((link) => {
    cy.findByRole('link', { name: link.label }).should('have.attr', 'href', link.url);
  });
});

Cypress.Commands.add('mobileCMSHeader', (mainLink, tagline, cmsLinks) => {
  cy.viewport(300, 720);
  cy.get('.dc-c-cmsheader').within((div) => {
    cy.findByRole('link', { name: mainLink.title }).should('have.attr', 'href', mainLink.url);
    cy.findByAltText(mainLink.altText).should('exist');
  });
  cy.findByText(tagline).should('not.exist');
  cy.get('.dc-c-cmsheader-menu').should('not.exist');
  cmsLinks.forEach((link) => {
    cy.findByRole('link', { name: link.label }).should('not.be.visible');
  });
});

Cypress.Commands.add('testNoCMSHeader', () => {
  cy.get('.dc-c-cmsheader').should('not.exist');
});

Cypress.Commands.add('testCMSHeader', (mainLink, tagline, cmsLinks) => {
  cy.desktopCMSHeader(mainLink, tagline, cmsLinks);
  cy.tabletCMSHeader(mainLink, tagline, cmsLinks);
  cy.mobileCMSHeader(mainLink, tagline, cmsLinks);
});
