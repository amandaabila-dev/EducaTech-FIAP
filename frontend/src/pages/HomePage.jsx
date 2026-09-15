import { useEffect, useState } from 'react';
import styled from 'styled-components';

import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import { listPosts, searchPosts } from '../services/api';
import { PageHeader, Subtitle } from '../styles/ui';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Counter = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

function normalizePosts(data) {
  return Array.isArray(data) ? data : data?.items ?? [];
}

function HomePage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function carregar(termo = '') {
    setLoading(true);
    setError('');

    try {
      const data = termo ? await searchPosts(termo) : await listPosts();
      setPosts(normalizePosts(data));
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const termo = input.trim();
    setQuery(termo);
    carregar(termo);
  }

  function handleClear() {
    setInput('');
    setQuery('');
    carregar();
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1>Postagens</h1>
          <Subtitle>Conteúdos publicados pelos professores do EducaTech.</Subtitle>
        </div>
      </PageHeader>

      <SearchBar
        value={input}
        onChange={setInput}
        onSubmit={handleSearch}
        onClear={handleClear}
      />

      <ErrorMessage message={error} onRetry={() => carregar(query)} />

      {loading && <Loading label="Carregando postagens…" />}

      {!loading && !error && posts.length === 0 && (
        <EmptyState
          title="Nenhuma postagem encontrada"
          description={
            query
              ? `Não encontramos resultados para "${query}". Tente outras palavras-chave.`
              : 'Ainda não há postagens publicadas.'
          }
        />
      )}

      {!loading && posts.length > 0 && (
        <>
          <Counter>
            {posts.length} {posts.length === 1 ? 'postagem encontrada' : 'postagens encontradas'}
          </Counter>

          <Grid>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Grid>
        </>
      )}
    </>
  );
}

export default HomePage;
