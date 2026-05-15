import React, { useState } from "react";
import {
  Container,
  ClearButton,
  FlexRow,
  SearchButton,
  SearchInput,
  Select,
  Title,
  PaginationButton,
  PaginationRow,
} from "./components";
import { I18N } from "../constants/i18n";
import { getPayments } from "../services/payments";
import { useQuery } from "@tanstack/react-query";
import { PaymentsTable } from "./PaymentsTable";
import { CURRENCIES } from "../constants";

// keeping this in the UI layer because this is responsible for rendering loading, error and empty states, and I want to keep the API logic in the service layer
// const EMPTY_PAYMENTS_RESPONSE: PaymentSearchResponse = {
//   payments: [],
//   total: 0,
//   page: 1,
//   pageSize: 5,
// };

export const PaymentsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments", search, currency, page],
    queryFn: () =>
      getPayments({
        search,
        currency,
        page,
        pageSize: 5,
      }),
    placeholderData: (previousData) => previousData,
  });

  // const paymentsData =
  //   data ?? EMPTY_PAYMENTS_RESPONSE;

  const hasActiveFilters = Boolean(search || currency);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
    setPage(1);
  }

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setCurrency("");
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <FlexRow>
        <SearchInput
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          aria-label={I18N.SEARCH_LABEL}
        />

        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={currency}
          onChange={
            handleCurrencyChange}
          style={{ marginLeft: 8 }}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.filter((c) =>
            ["USD", "EUR", "GBP", "AUD", "CAD", "ZAR"].includes(c),
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <SearchButton onClick={handleSearch}>{I18N.SEARCH_BUTTON}</SearchButton>
        {hasActiveFilters && (
          <ClearButton onClick={handleClear}>{I18N.CLEAR_FILTERS}</ClearButton>
        )}
      </FlexRow>

      <PaymentsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <PaginationRow>
        <PaginationButton onClick={handlePreviousPage} disabled={page === 1}>
          {I18N.PREVIOUS_BUTTON}
        </PaginationButton>
        <span>
          {I18N.PAGE_LABEL} {page}
        </span>
        <PaginationButton
          onClick={handleNextPage}
          disabled={data ? page >= Math.ceil(data.total / data.pageSize) : true}
        >
          {I18N.NEXT_BUTTON}
        </PaginationButton>
      </PaginationRow>
    </Container>
  );
};
