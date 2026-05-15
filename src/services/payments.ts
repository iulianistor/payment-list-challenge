import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}



// interface ApiError extends Error {
//     status: number;
// }

interface GetPaymentsParams {
    search?: string;
    currency?: string;
    page?: number;
    pageSize?: number;
}

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

// this is reusable, testable, scalable
// keeps API logic out of components
export const getPayments = async ({ search = "", currency = "", page = 1, pageSize = 5 }: GetPaymentsParams): Promise<PaymentSearchResponse> => {
    // URLSearchParams API provides read and write access to the query of a URL
    const params = new URLSearchParams({
        search, currency, page: String(page), pageSize: String(pageSize)
    })

    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
        throw new ApiError(response.status, "Failed to fetch payments"); //UI can rely on HTTP status, but not on backend-provided messages
    }

    return response.json();
}