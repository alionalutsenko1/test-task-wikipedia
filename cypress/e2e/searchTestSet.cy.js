/// <reference types="cypress" />
import * as allure from "allure-cypress";

describe('Search Test Set', () => {

    function inputTextForSearch(textForSearching) {
        allure.step("Type text for search", () => {
            cy.get('#searchInput').type(textForSearching);
        })
    }

    beforeEach(() => {
        allure.step("Open Wikipedia", () => {
            cy.visit('/')
        })
    })

    it('TC-1: Verify search using Search button', () => {
        const textForSearching = 'Cypress';

        inputTextForSearch(textForSearching)

        allure.step("Click Search button", () => {
            cy.get('#searchform > div > button').click({ force: true });
        })

        allure.step("Verify url includes '/wiki/Cypress'", () => {
            cy.url().should('include', '/wiki/Cypress');
        })

        allure.step(`Verify article title is ${textForSearching}`, () => {
            cy.get('#firstHeading > span').should('have.text', textForSearching);
        })

    })

    it('TC-2: Verify autocomplete suggestions appears when user types text for search', () => {
        cy.intercept('GET', '**/search/title?q=Albert+Ein&limit=10').as('searchRequest');

        const textForSearching = 'Albert Ein';

        inputTextForSearch(textForSearching)

        cy.wait('@searchRequest');

        allure.step(`Verify max number of autocomplete suggestions`, () => {
            cy.get('.cdx-menu__listbox').should('be.visible');
            cy.get('.cdx-menu__listbox li').should('have.length', 11).as('listItems');
        })

        allure.step(`Verify each item contains searched text`, () => {
            cy.get('@listItems').each(($el) => {
                cy.wrap($el).contains(textForSearching, { matchCase: false });
            });
        })
    })

    it('TC-3: Verify User can select an item from autosuggestions', () => {
        cy.intercept('GET', '**/search/title?q=Albert+Ein&limit=10').as('searchRequest');

        const textForSearching = 'Albert Ein';

        inputTextForSearch(textForSearching)

        cy.wait('@searchRequest');

        allure.step(`select item from autocomplete suggestions`, () => {
            cy.get('.cdx-menu__listbox li').contains('Albert Einstein House').click();
        })

        allure.step(`Verify url includes /wiki/Albert_Einstein_House`, () => {
            cy.url().should('include', '/wiki/Albert_Einstein_House');
        })

        allure.step(`Verify article title is correct`, () => {
            cy.get('#firstHeading > span').should('have.text', 'Albert Einstein House');
        })
    })

    it('TC-4: Verify User can select "Search for pages containing" and see all results', () => {
        const textForSearching = 'Cypress';

        inputTextForSearch(textForSearching)

        allure.step(`Select Search for pages containing`, () => {
            cy.get('.cdx-menu__listbox li').contains('Search for pages containing Cypress').click()
        })

        allure.step(`Verify search results contains max 20 items`, () => {
            cy.get('.mw-search-results li').should('have.length', 20)
        })

        allure.step(`Verify each item in search result contains searched text`, () => {
            cy.get('.mw-search-results li').each(($el) => {
                cy.wrap($el).contains('Cypress', { matchCase: false });
            });
        })

        allure.step(`Change number to display 50 items`, () => {
            cy.get('a[title="Show 50 results per page"]').eq(0).click()
        })

        allure.step(`Verify 50 items display in search result`, () => {
            cy.get('.mw-search-results li').should('have.length', 50)
        })
    })

})

describe('Change Language Test Set', () => {

    it('TC-5: Verify User can change language of article', () => {

        allure.step(`Open article`, () => {
            cy.visit('https://en.wikipedia.org/wiki/Albert_Einstein');
        })

        allure.step(`Change language to Espanol`, () => {
            cy.get('#p-lang-btn').click();
            cy.contains('a', 'Español').click();
        })

        allure.step(`Verify url ois correct`, () => {
            cy.url().should('include', 'https://es.wikipedia.org/wiki/Albert_Einstein');
        })

        allure.step(`Verify text is Espanol`, () => {
            cy.contains('Se le considera el científico más importante').should('be.visible');
        })
    })

})