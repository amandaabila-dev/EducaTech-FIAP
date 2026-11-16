import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  Card,
  EmptyState,
  ErrorBanner,
  IconButton,
  ItemTitle,
  Loading,
  Muted,
  Screen,
  ScreenHeader,
  Tag,
} from '../components/ui';
import { deletePost, listPosts } from '../services/api';
import { formatDate } from '../utils/format';

function normalizePosts(data) {
  return Array.isArray(data) ? data : data?.items ?? [];
}

export default function AdminPostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setPosts(normalizePosts(await listPosts()));
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(post) {
    Alert.alert('Excluir postagem', `Remover “${post.title}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(post.id);
            carregar();
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader
        title="Conteúdos"
        subtitle="Publique e organize as aulas da turma."
        countLabel={`${posts.length} postagens`}
        actionLabel="Nova postagem"
        onAction={() => navigation.navigate('PostForm')}
      />
      <ErrorBanner message={error} onRetry={carregar} />

      {loading && !posts.length ? (
        <Loading />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
          ListEmptyComponent={<EmptyState message="Nenhuma postagem cadastrada." />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  {item.subject ? (
                    <Tag
                      onPress={() =>
                        navigation.navigate('Home', { subject: item.subject })
                      }
                    >
                      {item.subject}
                    </Tag>
                  ) : null}
                  <ItemTitle>{item.title}</ItemTitle>
                  <Muted>
                    {item.author} · {formatDate(item.createdAt)}
                  </Muted>
                </View>
                <IconButton
                  label="Editar postagem"
                  name="create-outline"
                  onPress={() => navigation.navigate('PostForm', { id: item.id })}
                />
                <IconButton
                  label="Excluir postagem"
                  name="trash-outline"
                  variant="danger"
                  onPress={() => confirmarExclusao(item)}
                />
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
