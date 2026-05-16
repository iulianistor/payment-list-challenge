import { I18N } from "@/constants/i18n";
import { PaginationButton } from "./PaginationButton";
import { PaginationRow } from "./PaginationRow";

type Props = {
    page: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
};

export const Pagination = ({
    page,
    totalPages,
    onNext,
    onPrevious,
}: Props) => {
    return (
        <PaginationRow>
            <PaginationButton onClick={onPrevious} disabled={page === 1}>
                {I18N.PREVIOUS_BUTTON}
            </PaginationButton>

            <span>
                {I18N.PAGE_LABEL} {page}
            </span>

            <PaginationButton
                onClick={onNext}
                disabled={page >= totalPages}
            >
                {I18N.NEXT_BUTTON}
            </PaginationButton>
        </PaginationRow>
    );
};