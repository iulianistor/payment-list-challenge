import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaymentsPage } from "./PaymentsPage";
import { I18N } from "../../../constants/i18n";
import { getSearchInput } from "../../../test-utils";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithClient = (ui: React.ReactElement) =>
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

test("should enable clear button when a search filter is entered", async () => {
    renderWithClient(<PaymentsPage />);

    const searchInput = getSearchInput();
    const searchButton = screen.getByRole("button", { name: I18N.SEARCH_BUTTON });

    fireEvent.change(searchInput, { target: { value: "pay_134_1" } });
    fireEvent.click(searchButton);

    const clearButton = await screen.findByRole("button", { name: I18N.CLEAR_FILTERS });

    expect(clearButton).not.toBeDisabled();
});