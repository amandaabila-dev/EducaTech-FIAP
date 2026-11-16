import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Body, Button, Card, ErrorBanner, ItemTitle, Loading, Muted, Screen, Tag } from '../components/ui';
import { getPost } from '../services/api';
import { formatDate } from '../utils/format';

export default function PostScreen({ navigation, route }) {
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setPost(await getPost(id));
    } catch (err) {
      setError(err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (loading) {
    return (
      <Screen>
        <Loading label="Carregando postagem…" />
      </Screen>
    );
  }

  if (error || !post) {
    return (
      <Screen>
        <ErrorBanner message={error || 'Postagem não encontrada.'} onRetry={carregar} />
        <Button title="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Card>
          {post.subject ? (
            <Tag
              onPress={() =>
                navigation.navigate('Tabs', { screen: 'Home', params: { subject: post.subject } })
              }
            >
              {post.subject}
            </Tag>
          ) : null}
          <ItemTitle>{post.title}</ItemTitle>
          <Muted>
            {post.author} · {formatDate(post.createdAt)}
          </Muted>
          <Body>{post.content}</Body>
        </Card>
        <Button title="Voltar à lista" variant="secondary" onPress={() => navigation.goBack()} />
      </ScrollView>
    </Screen>
  );
}
