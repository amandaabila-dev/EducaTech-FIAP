import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0.6rem 1.2rem;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  text-decoration: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    text-decoration: none;
  }
`;

const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverse};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textInverse};

    &:hover:not(:disabled) {
      background-color: #911313;
    }
  `,
};

export const Button = styled.button`
  ${buttonBase}
  ${({ $variant = 'primary' }) => variants[$variant]}
`;

export const ButtonLink = styled(Link)`
  ${buttonBase}
  ${({ $variant = 'primary' }) => variants[$variant]}
`;

export const Card = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  h1 {
    margin: 0;
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 0.15rem 0.7rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 0.8rem;
  font-weight: 600;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  label {
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    background-color: ${({ theme }) => theme.colors.surface};
  }

  textarea {
    min-height: 220px;
    resize: vertical;
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;
