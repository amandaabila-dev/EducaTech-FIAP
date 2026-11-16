import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

function collectSubjects(items) {
  return [...new Set(items.map((post) => post.subject).filter(Boolean))].sort();
}

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [subjects, setSubjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function carregar(termo = '', materia = '') {
    setLoading(true);
    setError('');

    try {
      const data =
        termo || materia
          ? await searchPosts({ q: termo, subject: materia })
          : await listPosts();
      const items = normalizePosts(data);
      setPosts(items);
      if (!termo && !materia) setSubjects(collectSubjects(items));
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const materia = searchParams.get('subject') || '';
    setSubject(materia);
    carregar(query, materia);
  }, [searchParams]);

  function handleSearch(event) {
    event.preventDefault();
    const termo = input.trim();
    setQuery(termo);
    carregar(termo, subject);
  }

  function handleSubjectChange(materia) {
    if (materia) setSearchParams({ subject: materia });
    else setSearchParams({});
  }

  function handleClear() {
    setInput('');
    setQuery('');
    setSubject('');
    setSearchParams({});
    carregar();
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1>Postagens</h1>
          <Subtitle>Filtre por palavra-chave e por matéria.</Subtitle>
        </div>
      </PageHeader>

      <SearchBar
        value={input}
        onChange={setInput}
        subject={subject}
        subjects={subjects}
        onSubjectChange={handleSubjectChange}
        onSubmit={handleSearch}
        onClear={handleClear}
      />

      <ErrorMessage message={error} onRetry={() => carregar(query, subject)} />

      {loading && <Loading label="Carregando postagens…" />}

      {!loading && !error && posts.length === 0 && (
        <EmptyState
          title="Nenhuma postagem encontrada"
          description={
            query || subject
              ? 'Não encontramos resultados para os filtros informados. Tente outras palavras-chave ou matérias.'
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
