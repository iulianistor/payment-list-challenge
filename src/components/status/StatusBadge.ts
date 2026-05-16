import styled from "styled-components";

export const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  ${(props) =>
        props.status === "completed"
            ? `background-color: #d1fae5; color: #15803d;`
            : props.status === "pending"
                ? `background-color: #fef3c7; color: #92400e;`
                : `background-color: #fee2e2; color: #b91c1c;`}
`;