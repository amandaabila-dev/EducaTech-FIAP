import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { Button, Card, ErrorBanner, Field, Loading, Screen } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { createPost, getPost, updatePost } from '../services/api';

const EMPTY = { title: '', content: '', author: '', subject: '' };

export default function PostFormScreen({ navigation, route }) {
  const { id } = route.params || {};
  const { user } = useAuth();
  const [values, setValues] = useState({ ...EMPTY, author: user?.name || '' });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: id ? 'Editar postagem' : 'Nova postagem' });
  }, [id, navigation]);

  useEffect(() => {
    if (!id) return undefined;

    let ativo = true;
    setLoading(true);

    getPost(id)
      .then((post) => {
        if (!ativo) return;
        setValues({
          title: post.title || '',
          content: post.content || '',
          author: post.author || '',
          subject: post.subject || '',
        });
      })
      .catch((err) => {
        if (ativo) setError(err.message);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  function handleChange(campo, valor) {
    setValues((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit() {
    const title = values.title.trim();
    const content = values.content.trim();
    const author = values.author.trim();

    if (!title || !content || !author) {
      setError('Preencha título, conteúdo e autor.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const payload = { title, content, author, subject: values.subject.trim() || null };
      if (id) await updatePost(id, payload);
      else await createPost(payload);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <Loading label="Carregando dados da postagem…" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Card>
          <ErrorBanner message={error} />
          <Field label="Título" value={values.title} onChangeText={(value) => handleChange('title', value)} />
          <Field label="Autor" value={values.author} onChangeText={(value) => handleChange('author', value)} />
          <Field label="Matéria" value={values.subject} onChangeText={(value) => handleChange('subject', value)} />
          <Field
            label="Conteúdo"
            value={values.content}
            onChangeText={(value) => handleChange('content', value)}
            multiline
          />
          <Button title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSubmit} disabled={saving} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
