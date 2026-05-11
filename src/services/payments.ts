import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";

interface GetPaymentsParams {
    search?: string;
    currency?: string;
    page?: number;
    pageSize?: number;
}

// this is reusable, testable, scalable
// keeps API logic out of components
export const getPayments = async ({ search = "", currency = "", page = 1, pageSize = 5 }: GetPaymentsParams): Promise<PaymentSearchResponse> => {
    // URLSearchParams API provides read and write access to the query of a URL
    const params = new URLSearchParams({
        search, currency, page: String(page), pageSize: String(pageSize)
    })

    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
        throw new Error("Failed to fetch payments");
    }

    return response.json();
}