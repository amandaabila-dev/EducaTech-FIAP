import styled from 'styled-components';

const Box = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

function Loading({ label = 'Carregando…' }) {
  return (
    <Box role="status" aria-live="polite">
      {label}
    </Box>
  );
}

export default Loading;
