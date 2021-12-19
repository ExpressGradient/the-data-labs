const performLogin = () => {
    cy.get("input[name=username]").type("sai.praneeth.diddigam@gmail.com");
    cy.get("input[name=password]").type("abcABC123!@#");
    cy.contains("Continue").click();
    cy.visit("http://localhost:3000/dashboard");
};

describe("Navigation", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit("http://localhost:3000/");

        cy.contains("Login").click();
    });

    afterEach(() => {
        cy.visit("http://localhost:3000/api/auth/logout");
    });

    it("Perform Login", () => {
        performLogin();

        cy.url().should("include", "http://localhost:3000/dashboard");
    });

    it("Add records", () => {
        performLogin();

        cy.contains("The Florist").click();

        cy.url().should("include", "dashboard/labs/the-florist");

        cy.contains("crazy sales").click();

        cy.url().should(
            "include",
            "dashboard/labs/the-florist/models/crazy-sales"
        );

        cy.contains("Add Data Points").click();

        cy.get("input[name=flower]").type("Test Rose");

        cy.get("input[name=price]").type("100");

        cy.contains("Submit").click();

        cy.get("table").contains("Test Rose");
    });
});
