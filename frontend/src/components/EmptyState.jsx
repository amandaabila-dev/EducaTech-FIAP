import styled from 'styled-components';

const Box = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};

  p:last-child {
    margin-bottom: 0;
  }
`;

function EmptyState({ title, description, children }) {
  return (
    <Box>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </Box>
  );
}

export default EmptyState;
