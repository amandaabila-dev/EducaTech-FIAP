import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.danger};
`;

const RetryButton = styled.button`
  background: transparent;
  border: 1px solid currentColor;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: inherit;
  padding: 0.3rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <Box role="alert">
      <span>{message}</span>
      {onRetry && (
        <RetryButton type="button" onClick={onRetry}>
          Tentar novamente
        </RetryButton>
      )}
    </Box>
  );
}

export default ErrorMessage;
