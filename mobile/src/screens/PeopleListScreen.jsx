import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  Avatar,
  Card,
  EmptyState,
  ErrorBanner,
  IconButton,
  ItemTitle,
  Loading,
  Muted,
  Pager,
  Screen,
  ScreenHeader,
  Tag,
} from '../components/ui';

export default function PeopleListScreen({
  navigation,
  title,
  newLabel,
  emptyLabel,
  formRoute,
  loadPage,
  removeItem,
  subtitleFor,
  tagsFor,
  itemLabel,
  headerExtra,
}) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], totalPages: 0, total: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(async (pagina = 1) => {
    setLoading(true);
    setError('');

    try {
      const data = await loadPage(pagina);
      setResult(data);
      setPage(pagina);
    } catch (err) {
      setError(err.message);
      setResult({ items: [], totalPages: 0, total: 0, page: 1 });
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  useFocusEffect(
    useCallback(() => {
      carregar(page);
    }, [carregar, page])
  );

  function confirmarExclusao(item) {
    Alert.alert(`Excluir ${itemLabel}`, `Remover ${item.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(item.id);
            carregar(page);
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
        title={title}
        countLabel={`${result.total || 0} cadastrados`}
        actionLabel={newLabel}
        onAction={() => navigation.navigate(formRoute)}
      />
      {headerExtra}
      <ErrorBanner message={error} onRetry={() => carregar(page)} />

      {loading && !result.items.length ? (
        <Loading />
      ) : (
        <FlatList
          data={result.items}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => carregar(page)} />}
          ListEmptyComponent={<EmptyState message={emptyLabel} />}
          ListFooterComponent={
            <Pager
              page={result.page}
              totalPages={result.totalPages}
              onPrev={() => carregar(page - 1)}
              onNext={() => carregar(page + 1)}
            />
          }
          renderItem={({ item }) => {
            const tags = tagsFor?.(item) || [];
            return (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar name={item.name} />
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <ItemTitle>{item.name}</ItemTitle>
                  <Muted>{item.email}</Muted>
                  {subtitleFor?.(item) ? <Muted>{subtitleFor(item)}</Muted> : null}
                  {tags.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                      {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </View>
                  ) : null}
                </View>
                <IconButton
                  label={`Editar ${itemLabel}`}
                  name="create-outline"
                  onPress={() => navigation.navigate(formRoute, { id: item.id })}
                />
                <IconButton
                  label={`Excluir ${itemLabel}`}
                  name="trash-outline"
                  variant="danger"
                  onPress={() => confirmarExclusao(item)}
                />
              </View>
            </Card>
            );
          }}
        />
      )}
    </Screen>
  );
}
