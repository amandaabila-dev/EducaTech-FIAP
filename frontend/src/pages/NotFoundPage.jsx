import EmptyState from '../components/EmptyState';
import { ButtonLink } from '../styles/ui';

function NotFoundPage() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço acessado não existe no EducaTech."
    >
      <ButtonLink to="/">Ir para a página inicial</ButtonLink>
    </EmptyState>
  );
}

export default NotFoundPage;
