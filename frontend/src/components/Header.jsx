import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../contexts/AuthContext';
import { Button } from '../styles/ui';

const Bar = styled.header`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.textInverse};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.container};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;
  }
`;

const Brand = styled(Link)`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textInverse};

  &:hover {
    text-decoration: none;
  }

  strong {
    font-size: 1.25rem;
    letter-spacing: 0.02em;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

const Toggle = styled.button`
  display: none;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: ${({ theme }) => theme.radii.sm};
  color: inherit;
  padding: 0.4rem 0.7rem;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: inline-flex;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  a {
    color: ${({ theme }) => theme.colors.textInverse};
    font-weight: 600;
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;
  }

  a:hover {
    text-decoration: none;
    border-bottom-color: rgba(255, 255, 255, 0.6);
  }

  a.active {
    border-bottom-color: ${({ theme }) => theme.colors.textInverse};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    order: 3;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
  }
`;

const UserInfo = styled.span`
  font-size: 0.85rem;
  opacity: 0.85;
`;

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <strong>EducaTech FIAP</strong>
          <span>Blog educacional</span>
        </Brand>

        <Toggle
          type="button"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Toggle>

        <Nav id="menu-principal" $open={open} aria-label="Navegação principal">
          <NavLink to="/" end>
            Início
          </NavLink>

          {user ? (
            <>
              <NavLink to="/admin">Área do Professor</NavLink>
              <NavLink to="/admin/posts/novo">Nova Postagem</NavLink>
              <UserInfo>{user.name}</UserInfo>
              <Button type="button" $variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <NavLink to="/login">Entrar</NavLink>
          )}
        </Nav>
      </Inner>
    </Bar>
  );
}

export default Header;
