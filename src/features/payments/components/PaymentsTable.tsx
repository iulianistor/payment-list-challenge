import { ErrorBox } from "@/components/feedback/EmptyBox";
import { EmptyBox } from "@/components/feedback/ErrorBox";
import { Spinner } from "@/components/feedback/Spinner";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Table } from "@/components/table/Table";
import { TableBodyWrapper } from "@/components/table/TableBodyWrapper";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableHeaderRow } from "@/components/table/TableHeaderRow";
import { TableHeaderWrapper } from "@/components/table/TableHeaderWrapper";
import { TableRow } from "@/components/table/TableRow";
import { TableWrapper } from "@/components/table/TableWrapper";
import { I18N } from "@/constants/i18n";
import { isApiError } from "@/services/payments";
import { PaymentSearchResponse } from "@/types/payment";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";


interface PaymentsTableProps {
    data?: PaymentSearchResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
}

const getErrorMessage = (error: unknown) => {
    if (!isApiError(error)) {
        return I18N.SOMETHING_WENT_WRONG;
    }

    switch (error.status) {
        case 404:
            return I18N.PAYMENT_NOT_FOUND;
        case 500:
            return I18N.INTERNAL_SERVER_ERROR;
        default:
            return I18N.SOMETHING_WENT_WRONG;
    }
};

export const PaymentsTable = ({
    data,
    isLoading,
    isError,
    error,
}: PaymentsTableProps) => {

    const payments = data?.payments ?? [];


    return (
        <TableWrapper>
            <Table>
                <TableHeaderWrapper>
                    <TableHeaderRow>
                        <TableHeader>{I18N.TABLE_HEADER_PAYMENT_ID}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_DATE}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_AMOUNT}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_CUSTOMER}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_CURRENCY}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_STATUS}</TableHeader>
                    </TableHeaderRow>
                </TableHeaderWrapper>

                <TableBodyWrapper>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} aria-live="polite">
                                <Spinner />
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <ErrorBox>
                                    {getErrorMessage(error)}
                                </ErrorBox>
                            </TableCell>
                        </TableRow>
                    ) : payments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <EmptyBox>{I18N.NO_PAYMENTS_FOUND}</EmptyBox>
                            </TableCell>
                        </TableRow>
                    ) : (
                        payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>{formatDate(payment.date)}</TableCell>
                                <TableCell>
                                    {formatCurrency(payment.amount, payment.currency)}
                                </TableCell>
                                <TableCell>
                                    {payment.customerName || I18N.EMPTY_CUSTOMER}
                                </TableCell>
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
    );
};
