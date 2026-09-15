import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Field, Subtitle } from '../styles/ui';

const Wrapper = styled(Card)`
  max-width: 460px;
  margin: 0 auto;
`;

const Hint = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 0.9rem;
`;

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from || '/admin';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={destino} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      login(email, senha);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Wrapper>
      <h1>Entrar</h1>
      <Subtitle>Área exclusiva para professores publicarem e gerenciarem postagens.</Subtitle>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
        </Field>

        <Button type="submit">Entrar</Button>
      </form>

      <Hint>
        Credenciais de demonstração: <strong>professor@educatech.com</strong> / <strong>educatech123</strong>
      </Hint>
    </Wrapper>
  );
}

export default LoginPage;
