import { waitFor, screen } from "@testing-library/react";
import { expect } from "vitest";
import { format } from 'date-fns';
import { I18N } from "./constants/i18n";


// Helper function to robustly check for error messages with better debugging
export const waitForErrorMessage = async (expectedMessage: string, timeout = 10000) => {
    try {
        await waitFor(() => {
            expect(screen.getByText(expectedMessage)).toBeInTheDocument();
        }, { timeout });
    } catch (error) {
        // If the expected message isn't found, let's see what error messages are actually on the page
        const errorElements = screen.queryAllByText(/error|not found|server/i);
        const errorTexts = errorElements.map(el => el.textContent).filter(Boolean);

        throw new Error(
            `Expected error message "${expectedMessage}" not found. ` +
            `Available error-related text: ${errorTexts.join(', ') || 'None found'}`
        );
    }
};

export const getTableCellsByColumnName = (columnName: string, rowIndex: number) => {
    const headers = screen.getAllByRole('columnheader');

    const columnIndex = headers.findIndex((header) =>
        (header?.textContent || '').includes(columnName),
    );

    if (columnIndex === -1) {
        throw new Error(`Column name not found`);
    }

    const rows = screen.getAllByRole('row').slice(1);

    if (rowIndex !== null) {
        const cells = rows[rowIndex]?.querySelectorAll('td');
        return cells?.[columnIndex];
    } else {
        throw new Error(`Row not found`);
    }
};

export const formattedDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy, HH:mm:ss")
};

export const getSearchInput = () => {
    // Try to find by placeholder first, then by role with name
    try {
        return screen.getByPlaceholderText(I18N.SEARCH_PLACEHOLDER);
    } catch {
        return screen.getByRole("searchbox", { name: I18N.SEARCH_LABEL });
    }
};