import styled from "styled-components";

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;

  &:focus {
    border-color: rgb(61, 70, 83);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }

  @media (min-width: 768px) {
    width: 50%;
  }
`;
