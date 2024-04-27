/// <reference types="cypress" />

describe('Search Test Set', () => {

    beforeEach(() => {
        cy.visit('/')
    })

    it('TC-1: Verify search using Search button', () => {
        const textForSerching = 'Cypress';

        cy.get('#searchInput').type(textForSerching);
        cy.get('#searchform > div > button').click({ force: true });
        cy.url().should('include', '/wiki/Cypress');
        cy.get('#firstHeading > span').should('have.text', textForSerching);
    })

    it('TC-2: Verify autocomplete suggestions appears when user types text for search', () => {
        cy.intercept('GET', '**/search/title?q=Albert+Ein&limit=10').as('searchRequest');

        const textForSerching = 'Albert Ein';
        cy.get('#searchInput').type(textForSerching, { delay: 100 });
        cy.wait('@searchRequest');
        cy.get('.cdx-menu__listbox').should('be.visible');
        cy.get('.cdx-menu__listbox li').should('have.length', 11).as('listItems');
        cy.get('@listItems').each(($el) => {
            cy.wrap($el).contains(textForSerching, { matchCase: false });
        });
    })

    it('TC-3: Verify User can select an item from autosuggestions', () => {
        cy.intercept('GET', '**/search/title?q=Albert+Ein&limit=10').as('searchRequest');

        const textForSerching = 'Albert Ein';
        cy.get('#searchInput').type(textForSerching, { delay: 100 });
        cy.wait('@searchRequest');
        cy.get('.cdx-menu__listbox li').contains('Albert Einstein House').click();
        cy.url().should('include', '/wiki/Albert_Einstein_House');
        cy.get('#firstHeading > span').should('have.text', 'Albert Einstein House');
    })

    it('TC-4: Verify User can select "Search for pages containing" and see all results', () => {
        const textForSerching = 'Cypress';

        cy.get('#searchInput').type(textForSerching, { delay: 100 });
        cy.get('.cdx-menu__listbox li').contains('Search for pages containing Cypress').click()
        cy.get('.mw-search-results li').should('have.length', 20)
        cy.get('.mw-search-results li').each(($el) => {
            cy.wrap($el).contains('Cypress', { matchCase: false });
        });
        cy.get('a[title="Show 50 results per page"]').eq(0).click()
        cy.get('.mw-search-results li').should('have.length', 50)
    })

})

describe('Change Language Test Set', () => {

    it('TC-5: Verify User can change language of article', () => {
        cy.visit('https://en.wikipedia.org/wiki/Albert_Einstein');

        cy.get('#p-lang-btn').click();
        cy.contains('a', 'Español').click();
        cy.url().should('include', 'https://es.wikipedia.org/wiki/Albert_Einstein');
        cy.contains('Se le considera el científico más importante').should('be.visible');
    })

})