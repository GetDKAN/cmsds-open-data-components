Cypress.Commands.add('testFooterGetUpdates', (title, description, link) => {
  cy.findByRole('heading', { name: title, level: 2 }).should('exist');
  cy.findByText(description).should('exist');
  cy.findByRole('link', { name: link.label }).should('have.attr', 'href', link.url);
});

Cypress.Commands.add('testFooterCMSInfo', () => {
  cy.findByRole('link', {
    name: 'U.S. Department of Health & Human Services',
  }).should('have.attr', 'href', 'http://www.hhs.gov/'); //change to https when moving upstream
  cy.findByAltText('HHS Logo').should('exist');
  cy.findByRole('link', {
    name: 'CMS.gov Centers for Medicare & Medicaid Services',
  }).should('have.attr', 'href', 'http://www.cms.gov/'); //change to https when moving upstream
  cy.findByAltText('CMS Logo').should('exist');
  cy.findByText(
    'A federal government website managed and paid for by the U.S. Centers for Medicare & Medicaid Services.'
  ).should('exist');
  cy.findByText('7500 Security Boulevard, Baltimore, MD 21244').should('exist');
});

Cypress.Commands.add('testFooterGlobalLinks', (links) => {
  cy.get('.dc-c-footer__utility').findAllByRole('listitem').should('have.length', links.length);
  links.forEach((link) => {
    cy.findByRole('link', { name: link.label }).should('have.attr', 'href', link.url);
  });
});

Cypress.Commands.add('testFooterSocialLinks', (links) => {
  cy.get('.dc-c-footer__cms-information')
    .findAllByRole('listitem')
    .should('have.length', links.length);
  links.forEach((link) => {
    const currentLink = cy.findByRole('link', { name: link.label });
    currentLink.should('have.attr', 'href', link.url);
    currentLink.within(() => {
      // The background circle SVG doesn't have a role of img.
      cy.findAllByRole('img').should('have.length', 1);
    });
  });
});

Cypress.Commands.add('testFooterResource', (links, title) => {
  const heading = cy.findByRole('heading', { name: title, level: 2 });
  heading.should('exist');
  heading.parent().findAllByRole('listitem').should('have.length', links.length);
  links.forEach((link) => {
    const currentLink = cy.findByRole('link', { name: link.label });
    currentLink.should('have.attr', 'href', link.url);
  });
});
