import React from "react";
import { Container, EmptyBox, ErrorBox, Spinner, StatusBadge, Table, TableBodyWrapper, TableCell, TableHeader, TableHeaderRow, TableHeaderWrapper, TableRow, TableWrapper, Title } from "./components";
import { I18N } from "../constants/i18n";
import { formatDate } from "../utils/formatDate";
import { getPayments } from "../services/payments";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../utils/formatCurrency";

// responsible for fetching, rendering states, rendering table
export const PaymentsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", 1],
    queryFn: () => getPayments({
      page: 1, pageSize: 5
    })
  })

  if (isLoading) {
    return (
      <Container>
        <Spinner />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <ErrorBox>{I18N.SOMETHING_WENT_WRONG}</ErrorBox>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <EmptyBox>{I18N.NO_PAYMENTS_FOUND}</EmptyBox>
      </Container>
    )
  }

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

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
            {data.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>

                <TableCell>
                  {formatDate(payment.date)}
                </TableCell>

                <TableCell>
                  {formatCurrency(
                    payment.amount,
                    payment.currency
                  )}
                </TableCell>

                <TableCell>
                  {payment.customerName ||
                    I18N.EMPTY_CUSTOMER}
                </TableCell>

                <TableCell>
                  {payment.currency ||
                    I18N.EMPTY_CURRENCY}
                </TableCell>

                <TableCell>
                  <StatusBadge status={payment.status}>
                    {payment.status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBodyWrapper>
        </Table>
      </TableWrapper>
    </Container>
  );
};
