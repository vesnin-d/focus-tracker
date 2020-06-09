describe('For not logged-in users', () => {
    it('displays welcome message', () => {
        cy.visit('/')
  
        cy.contains('Welcome')
    });

    it('displays login form on sign-in link click', () => {
        cy.visit('/')
  
        cy.get('.link').click();

        cy.get('.login-form').should('be.visible'); 
    });
})