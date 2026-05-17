import React, { useState } from "react";

import { Container } from "@/components/layout/Container";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/services/payments";
import { Title } from "@/components/layout/Title";
import { I18N } from "@/constants/i18n";
import { FlexRow } from "@/components/layout/FlexRow";
import { SearchInput } from "@/components/form/SearchInput";
import { Select } from "@/components/form/Select";
import { CURRENCIES } from "@/constants";
import { SearchButton } from "@/components/form/SearchButton";
import { ClearButton } from "@/components/form/ClearButton";
import { PaymentsTable } from "./PaymentsTable";
import { Pagination } from "./pagination/Pagination";

type DraftFilters = {
  search: string;
  currency: string;
};

type AppliedFilters = {
  search: string;
  currency: string;
  page: number;
};

export const PaymentsPage = () => {
  // UI state (what user is currently typing/selecting)
  const [draftFilters, setDraftFilters] = useState<DraftFilters>({
    search: "",
    currency: "",
  });

  // SINGLE source of truth for API
  // API state (what is actually applied to the request)
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    search: "",
    currency: "",
    page: 1,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments", appliedFilters],
    queryFn: () =>
      getPayments({
        search: appliedFilters.search,
        currency: appliedFilters.currency,
        page: appliedFilters.page,
        pageSize: 5,
      }),
    placeholderData: (previousData) => previousData,
  });

  const hasActiveFilters = Boolean(
    appliedFilters.search !== "" || appliedFilters.currency !== ""
  );

  // search happens only on button click, commit eveything at once
  // no need to rely on prev state here since I'm doing a full overwrite
  const handleSearch = () => {
    setAppliedFilters({
      search: draftFilters.search.trim(),
      currency: draftFilters.currency,
      page: 1,
    });
  };

  // clear everything
  const handleClear = () => {
    setDraftFilters({ search: "", currency: "" });

    setAppliedFilters({
      search: "",
      currency: "",
      page: 1,
    });
  };

  // pagination
  const handleNextPage = () => {
    console.log("NEXT PAGE");
    setAppliedFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const handlePreviousPage = () => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <FlexRow>
        {/* UI state only */}
        <SearchInput
          type="search"
          value={draftFilters.search}
          onChange={(e) =>
            setDraftFilters((prev) => ({
              ...prev,
              search: e.target.value,
            }))
          } placeholder={I18N.SEARCH_PLACEHOLDER}
          aria-label={I18N.SEARCH_LABEL}
        />

        {/* Currency dropdown is also UI only */}
        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={draftFilters.currency}
          onChange={(e) =>
            setDraftFilters((prev) => ({
              ...prev,
              currency: e.target.value,
            }))
          }
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.filter((c) =>
            ["USD", "EUR", "GBP", "AUD", "CAD", "ZAR"].includes(c)
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <SearchButton onClick={handleSearch}>
          {I18N.SEARCH_BUTTON}
        </SearchButton>

        {hasActiveFilters && (
          <ClearButton onClick={handleClear}>
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FlexRow>

      <PaymentsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <Pagination
        page={appliedFilters.page}
        totalPages={data ? Math.ceil(data.total / data.pageSize) : 1}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
      />
    </Container>
  );
};