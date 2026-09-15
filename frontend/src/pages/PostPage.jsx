import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { getPost } from '../services/api';
import { ButtonLink, Card, Tag } from '../styles/ui';
import { formatDate } from '../utils/format';

const Article = styled(Card).attrs({ as: 'article' })`
  h1 {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Content = styled.div`
  white-space: pre-wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(() => {
    let ativo = true;

    setLoading(true);
    setError('');

    getPost(id)
      .then((data) => {
        if (ativo) setPost(data);
      })
      .catch((err) => {
        if (!ativo) return;
        setError(err.message);
        setPost(null);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(carregar, [carregar]);

  if (loading) return <Loading label="Carregando postagem…" />;

  if (error) {
    return (
      <>
        <ErrorMessage message={error} onRetry={carregar} />
        <ButtonLink to="/" $variant="secondary">
          Voltar para a lista
        </ButtonLink>
      </>
    );
  }

  if (!post) return null;

  return (
    <Article>
      {post.subject && <Tag>{post.subject}</Tag>}

      <h1>{post.title}</h1>

      <Meta>
        Por {post.author}
        {post.createdAt && ` · publicado em ${formatDate(post.createdAt)}`}
        {post.updatedAt && post.updatedAt !== post.createdAt
          ? ` · atualizado em ${formatDate(post.updatedAt)}`
          : ''}
      </Meta>

      <Content>{post.content}</Content>

      <ButtonLink to="/" $variant="secondary">
        Voltar para a lista
      </ButtonLink>
    </Article>
  );
}

export default PostPage;
