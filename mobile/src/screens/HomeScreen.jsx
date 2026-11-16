import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  Card,
  Chip,
  EmptyState,
  ErrorBanner,
  ItemTitle,
  Loading,
  Muted,
  Screen,
  ScreenHeader,
  SearchBar,
  Tag,
} from '../components/ui';
import { listPosts, searchPosts } from '../services/api';
import { buildExcerpt, formatDate } from '../utils/format';

function normalizePosts(data) {
  return Array.isArray(data) ? data : data?.items ?? [];
}

function collectSubjects(items) {
  return [...new Set(items.map((post) => post.subject).filter(Boolean))].sort();
}

export default function HomeScreen({ navigation, route }) {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState(route.params?.subject || '');
  const [subjects, setSubjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(async (termo = '', materia = '') => {
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar(query, subject);
    }, [carregar, query, subject])
  );

  useEffect(() => {
    const materia = route.params?.subject;
    if (!materia) return;
    setSubject(materia);
    carregar(query, materia);
    navigation.setParams({ subject: undefined });
  }, [carregar, navigation, query, route.params?.subject]);

  function buscar() {
    const termo = input.trim();
    setQuery(termo);
    carregar(termo, subject);
  }

  function escolherMateria(materia) {
    const selecionada = materia === subject ? '' : materia;
    setSubject(selecionada);
    carregar(query, selecionada);
  }

  function limpar() {
    setInput('');
    setQuery('');
    setSubject('');
    carregar('', '');
  }

  const filtrando = Boolean(query || subject);

  return (
    <Screen>
      <ScreenHeader
        title="Sala de aula"
        subtitle="Explore as postagens por matéria e palavra-chave."
      />

      <SearchBar
        value={input}
        onChangeText={setInput}
        onSubmit={buscar}
        placeholder="Buscar por tema, autor ou palavra"
      />

      {subjects.length > 0 ? (
        <View style={{ marginBottom: 8 }}>
          <Muted>Trilhas</Muted>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            <Chip label="Todas" selected={!subject} onPress={() => escolherMateria('')} />
            {subjects.map((materia) => (
              <Chip
                key={materia}
                label={materia}
                selected={subject === materia}
                onPress={() => escolherMateria(materia)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {filtrando ? (
        <Pressable onPress={limpar} style={{ marginBottom: 12 }}>
          <Muted>Limpar filtros</Muted>
        </Pressable>
      ) : null}

      <ErrorBanner message={error} onRetry={() => carregar(query, subject)} />

      {loading && !posts.length ? (
        <Loading label="Carregando postagens…" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => carregar(query, subject)} />
          }
          ListEmptyComponent={<EmptyState message="Nenhuma postagem encontrada." />}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('Post', { id: item.id })}>
              <Card>
                {item.subject ? (
                  <Tag onPress={() => escolherMateria(item.subject)}>{item.subject}</Tag>
                ) : null}
                <ItemTitle>{item.title}</ItemTitle>
                <Muted>
                  {item.author} · {formatDate(item.createdAt)}
                </Muted>
                <Muted style={{ marginTop: 6 }}>{buildExcerpt(item.content)}</Muted>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
