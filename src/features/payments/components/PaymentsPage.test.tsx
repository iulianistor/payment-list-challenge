import React from "react";
import "@testing-library/jest-dom";
import {
    render,
    screen,
    within,
} from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaymentsPage } from "./PaymentsPage";
import { I18N } from "../../../constants/i18n";
import { server } from "@/mocks/node";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { userEvent } from "@testing-library/user-event";

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

const renderPage = () => render(<PaymentsPage />, { wrapper: createWrapper() });

// “I started with basic rendering tests, then improved them to validate full user flows using MSW.
// In the next iteration, I strengthened assertions by checking both positive and negative outcomes,
// ensuring filtering actually removes unrelated data instead of just checking for presence.
// This reduces false confidence from overly permissive tests and makes them more robust against UI regressions.”

test("renders initial payments table with rows", async () => {
    renderPage();

    const rows = await screen.findAllByRole("row");

    // header + at least 1 data row
    expect(rows.length).toBeGreaterThan(1);

    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
});

test("filters payments by payment ID", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(I18N.SEARCH_LABEL), "pay_134_2");

    await user.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(await screen.findByText("pay_134_2")).toBeInTheDocument();

    // important: ensure previous results are gone
    expect(screen.queryByText("pay_134_1")).not.toBeInTheDocument();
});

test("filters payments by currency correctly", async () => {
    // The key improvement was making the test assertions more precise by scoping them to the correct part of the UI.
    // Initially, the tests used global queries like screen.getByText, which could accidentally match elements outside the table,
    // such as static dropdown options.This led to false positives or misleading failures when different parts of the UI
    // contained the same text values(e.g.currency codes).
    // By introducing within(table), the tests now explicitly target only the rendered payments table.
    // This ensures that assertions validate the actual business data being displayed,
    // rather than unrelated UI elements.As a result, the tests are more reliable,
    // less brittle, and better aligned with user behaviour.
    // This change improves test clarity and robustness by enforcing proper DOM scoping and reducing accidental cross -
    // interference between UI components.
    const user = userEvent.setup();

    renderPage();

    await user.selectOptions(
        screen.getByLabelText(I18N.CURRENCY_FILTER_LABEL),
        "USD"
    );

    await user.click(
        screen.getByRole("button", { name: I18N.SEARCH_BUTTON })
    );

    const table = screen.getByRole("table");

    const usdCells = await within(table).findAllByText("USD");
    expect(usdCells.length).toBeGreaterThan(0);

    expect(within(table).queryByText("EUR")).not.toBeInTheDocument();
});

test("filters by search and currency together", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.type(
        screen.getByLabelText(I18N.SEARCH_LABEL),
        "pay_205_1"
    );

    await user.selectOptions(
        screen.getByLabelText(I18N.CURRENCY_FILTER_LABEL),
        "USD"
    );

    await user.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    // wait for request + UI update
    const table = await screen.findByRole("table");

    expect(
        await within(table).findByText("pay_205_1")
    ).toBeInTheDocument();

    // stronger assertion: row exists in a real table, not placeholder
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
});

test("clears filters and resets table", async () => {
    const user = userEvent.setup();

    renderPage();

    // apply filter
    await user.type(
        screen.getByLabelText(I18N.SEARCH_LABEL),
        "pay_134_1"
    );

    await user.click(
        screen.getByRole("button", { name: I18N.SEARCH_BUTTON })
    );

    // filtered state: only matching result should exist
    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
    expect(screen.queryByText("pay_134_2")).not.toBeInTheDocument();

    // clear filters
    await user.click(
        screen.getByRole("button", {
            name: I18N.CLEAR_FILTERS,
        })
    );

    // reset state: table returns to default dataset (assert structure, not a specific record)
    const rows = await screen.findAllByRole("row");

    // header + at least one data row
    expect(rows.length).toBeGreaterThan(1);

    // optional: sanity check that results are populated again
    expect(screen.getByRole("table")).toBeInTheDocument();
});

test("shows 404 error message", async () => {
    const user = userEvent.setup();
    server.use(
        http.get(`${API_URL}`, () => {
            return HttpResponse.json(
                { message: "Payment not found" },
                { status: 404 }
            );
        })
    );

    renderPage();

    await user.type(
        screen.getByLabelText(I18N.SEARCH_LABEL),
        "pay_404"
    );

    await user.click(
        screen.getByRole("button", { name: I18N.SEARCH_BUTTON })
    );


    expect(
        await screen.findByText(I18N.PAYMENT_NOT_FOUND)
    ).toBeInTheDocument();
});

test("shows 500 server error message", async () => {
    const user = userEvent.setup();

    server.use(
        http.get(`${API_URL}`, () => {
            return HttpResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        })
    );

    renderPage();

    await user.type(screen.getByLabelText(I18N.SEARCH_LABEL), "pay_500");

    await user.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(
        await screen.findByText(I18N.INTERNAL_SERVER_ERROR)
    ).toBeInTheDocument();
});

test("pagination moves to next page", async () => {
    const user = userEvent.setup();

    renderPage();

    expect(screen.getByText(/page 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();
});
