import React, { useState } from "react";
import { Container, ClearButton, FlexRow, SearchButton, SearchInput, Title } from "./components";
import { I18N } from "../constants/i18n";
import { getPayments } from "../services/payments";
import { useQuery } from "@tanstack/react-query";
import { PaymentsTable } from "./PaymentsTable";

// keeping this in the UI layer ebecause this is responsible for rendering loading, error and empty states, and I want to keep the API logic in the service layer
// const EMPTY_PAYMENTS_RESPONSE: PaymentSearchResponse = {
//   payments: [],
//   total: 0,
//   page: 1,
//   pageSize: 5,
// };

export const PaymentsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments", search],
    queryFn: () =>
      getPayments({
        search,
        page: 1,
        pageSize: 5,
      }),
  });

  // const paymentsData =
  //   data ?? EMPTY_PAYMENTS_RESPONSE;

  const hasActiveFilters = Boolean(search); //|| currency

  const handleSearch = () => {
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
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
        <SearchButton onClick={handleSearch}>
          {I18N.SEARCH_BUTTON}
        </SearchButton>
        {hasActiveFilters && <ClearButton onClick={handleClear}>
          {I18N.CLEAR_FILTERS}
        </ClearButton>}
      </FlexRow>

      <PaymentsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />  </Container>
  );
};
