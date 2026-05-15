import React, { useState } from "react";
import { Container, EmptyBox, ErrorBox, FlexRow, SearchButton, SearchInput, Spinner, StatusBadge, Table, TableBodyWrapper, TableCell, TableHeader, TableHeaderRow, TableHeaderWrapper, TableRow, TableWrapper, Title } from "./components";
import { I18N } from "../constants/i18n";
import { formatDate } from "../utils/formatDate";
import { getPayments } from "../services/payments";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../utils/formatCurrency";

// responsible for fetching, rendering states, rendering table
export const PaymentsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", search],
    queryFn: () => getPayments({
      search,
      page: 1, pageSize: 5
    })
  })
  // if (isLoading) {
  //   return (
  //     <Container>
  //       <Spinner />
  //     </Container>
  //   )
  // }

  // if (isError) {
  //   return (
  //     <Container>
  //       <ErrorBox>{I18N.SOMETHING_WENT_WRONG}</ErrorBox>
  //     </Container>
  //   )
  // }

  const handleSearch = () => {
    setSearch(searchInput);
  }

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
  }

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <FlexRow>
        <SearchInput
          type="text"
          role="searchbox"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          aria-label={I18N.SEARCH_LABEL}
        />

        <SearchButton onClick={handleSearch}>
          {I18N.SEARCH_BUTTON}
        </SearchButton>
      </FlexRow>

      <TableWrapper>
        <Table>
          <TableHeaderWrapper>
            <TableHeaderRow>
              <TableHeader>
                {I18N.TABLE_HEADER_PAYMENT_ID}
              </TableHeader>
              <TableHeader>
                {I18N.TABLE_HEADER_DATE}
              </TableHeader>

              <TableHeader>
                {I18N.TABLE_HEADER_AMOUNT}
              </TableHeader>

              <TableHeader>
                {I18N.TABLE_HEADER_CUSTOMER}
              </TableHeader>

              <TableHeader>
                {I18N.TABLE_HEADER_CURRENCY}
              </TableHeader>

              <TableHeader>
                {I18N.TABLE_HEADER_STATUS}
              </TableHeader>
            </TableHeaderRow>
          </TableHeaderWrapper>

          <TableBodyWrapper>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <ErrorBox>{I18N.SOMETHING_WENT_WRONG}</ErrorBox>
                </TableCell>
              </TableRow>
            ) : !data || data.payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyBox>{I18N.NO_PAYMENTS_FOUND}</EmptyBox>
                </TableCell>
              </TableRow>
            ) : (
              data.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>{payment.customerName || I18N.EMPTY_CUSTOMER}</TableCell>
                  <TableCell>{payment.currency || I18N.EMPTY_CURRENCY}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status}>
                      {payment.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBodyWrapper>
        </Table>
      </TableWrapper>
    </Container>
  );
};
