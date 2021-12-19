/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import fetch from "node-fetch";

describe("Sample Unit Test Suite", () => {
    it("Check if Login Button exists", () => {
        render(<Home />);

        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("Check if data is getting inserted using the API key", async () => {
        const apiKey = "some-api-key";

        const record = {
            cake: "dark forest",
            stock: 20,
            price: 250
        }

        const res = await fetch(`https://the-data-labs.vercel.app/api/cake-price-prediction/new?apiKey=${apiKey}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(record),
        });

        expect(res.status).toBe(200);
    })
});
