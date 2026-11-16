import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { Button, Card, ErrorBanner, Field, Loading, Screen, Subtitle } from '../components/ui';
import { createTeacher, getTeacher, updateTeacher } from '../services/api';

const EMPTY = { name: '', email: '', password: '' };

export default function TeacherFormScreen({ navigation, route }) {
  const { id } = route.params || {};
  const [values, setValues] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: id ? 'Editar professor' : 'Novo professor' });
  }, [id, navigation]);

  useEffect(() => {
    if (!id) return undefined;

    let ativo = true;
    setLoading(true);

    getTeacher(id)
      .then((teacher) => {
        if (!ativo) return;
        setValues({ name: teacher.name || '', email: teacher.email || '', password: '' });
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
    if (!values.name.trim() || !values.email.trim() || (!id && !values.password)) {
      setError('Preencha nome, e-mail e senha (obrigatória na criação).');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const payload = { name: values.name.trim(), email: values.email.trim() };
      if (values.password) payload.password = values.password;
      if (id) await updateTeacher(id, payload);
      else await createTeacher(payload);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Card>
          <Subtitle>
            {id ? 'Deixe a senha em branco para manter a atual.' : 'Cadastre um docente com acesso à área administrativa.'}
          </Subtitle>
          <ErrorBanner message={error} />
          <Field label="Nome" value={values.name} onChangeText={(value) => handleChange('name', value)} />
          <Field
            label="E-mail"
            value={values.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCapitalize="none"
          />
          <Field
            label="Senha"
            value={values.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
          />
          <Button title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSubmit} disabled={saving} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
