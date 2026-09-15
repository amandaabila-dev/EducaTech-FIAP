import styled from 'styled-components';

const Bar = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.container};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: space-between;
`;

function Footer() {
  return (
    <Bar>
      <Inner>
        <span>EducaTech FIAP — Tech Challenge Fase 3</span>
        <span>FIAP Pós Tech — Full Stack Development</span>
      </Inner>
    </Bar>
  );
}

export default Footer;
