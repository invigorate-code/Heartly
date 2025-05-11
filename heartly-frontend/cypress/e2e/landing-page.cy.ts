describe('Landing Page Inital Load', () => {
  before(() => {
    cy.visit('http://localhost:3000')

    cy.window().should('have.property', 'document')
    .its('readyState').should('eq', 'complete');

  })
  it('should display the LandingPage component and all elements', () => {
    cy.scrollTo('top')
    cy.document().then((doc) => {
      const scrollHeight = doc.documentElement.scrollHeight
      const viewportHeight = Cypress.config('viewportHeight')
      let scrollPosition = 0

      // Perform the scroll and allow animations to complete
      while (scrollPosition < scrollHeight) {
        scrollPosition += viewportHeight / 2; 
        if (scrollPosition > scrollHeight) scrollPosition = scrollHeight;

        cy.scrollTo(0, scrollPosition);
        cy.wait(800);

      }
    })
    
    cy.get('[data-testid="hero-section"]')
    .should('exist')
    .and('be.visible')
    
    cy.get('[data-testid="features-section"]')
    .should('exist')
    .and('be.visible')
    
    cy.get('[data-testid="benefits-section"]')
    .should('exist')
    .and('be.visible')
    
    cy.get('[data-testid="cta-section"]')
    .should('exist')
    .and('be.visible')
  })

})