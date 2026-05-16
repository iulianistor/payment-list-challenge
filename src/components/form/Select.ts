import styled from "styled-components";

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: rgb(61, 70, 83);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }

  @media (min-width: 768px) {
    min-width: 120px;
  }
`;