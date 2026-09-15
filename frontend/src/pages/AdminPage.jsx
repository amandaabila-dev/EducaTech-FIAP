import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { deletePost, listPosts } from '../services/api';
import { Button, ButtonLink, Card, PageHeader, Subtitle } from '../styles/ui';
import { formatDate } from '../utils/format';

const TableWrapper = styled(Card)`
  padding: 0;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;

  th,
  td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: top;
  }

  th {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Success = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
`;

function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(location.state?.message || '');

  const carregar = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await listPosts();
      setPosts(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  async function handleDelete(post) {
    const ok = window.confirm(
      `Tem certeza que deseja excluir "${post.title}"? Essa ação não pode ser desfeita.`
    );
    if (!ok) return;

    setFeedback('');
    setError('');

    try {
      await deletePost(post.id);
      setFeedback('Postagem excluída com sucesso.');
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1>Área do Professor</h1>
          <Subtitle>Gerencie todas as postagens publicadas no EducaTech.</Subtitle>
        </div>

        <ButtonLink to="/admin/posts/novo">Nova Postagem</ButtonLink>
      </PageHeader>

      {feedback && <Success role="status">{feedback}</Success>}

      <ErrorMessage message={error} onRetry={carregar} />

      {loading && <Loading label="Carregando postagens…" />}

      {!loading && posts.length === 0 && !error && (
        <EmptyState
          title="Nenhuma postagem cadastrada"
          description="Crie a primeira postagem para que os alunos possam acessá-la."
        >
          <ButtonLink to="/admin/posts/novo">Nova Postagem</ButtonLink>
        </EmptyState>
      )}

      {!loading && posts.length > 0 && (
        <TableWrapper>
          <Table>
            <caption hidden>
              Lista de postagens com opções de edição e exclusão
            </caption>
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Autor</th>
                <th scope="col">Matéria</th>
                <th scope="col">Criado em</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.subject || '—'}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <RowActions>
                      <ButtonLink
                        to={`/admin/posts/${post.id}/editar`}
                        $variant="secondary"
                        aria-label={`Editar a postagem ${post.title}`}
                      >
                        Editar
                      </ButtonLink>
                      <Button
                        type="button"
                        $variant="danger"
                        aria-label={`Excluir a postagem ${post.title}`}
                        onClick={() => handleDelete(post)}
                      >
                        Excluir
                      </Button>
                    </RowActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </>
  );
}

export default AdminPage;
