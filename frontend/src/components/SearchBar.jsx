import styled from 'styled-components';

import { Button } from '../styles/ui';

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Field = styled.div`
  flex: 1 1 220px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  input {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const Clear = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 0.65rem 1rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function SearchBar({ value, onChange, onSubmit, onClear }) {
  return (
    <Form role="search" onSubmit={onSubmit}>
      <Field>
        <label htmlFor="busca">Buscar postagens</label>
        <input
          id="busca"
          type="search"
          placeholder="Digite um título, autor, matéria ou palavra-chave"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>

      <Button type="submit">Buscar</Button>

      {value && (
        <Clear type="button" onClick={onClear}>
          Limpar
        </Clear>
      )}
    </Form>
  );
}

export default SearchBar;
