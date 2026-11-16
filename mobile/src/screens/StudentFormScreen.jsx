import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Card, Chip, ErrorBanner, Field, Loading, Muted, Screen } from '../components/ui';
import { SUBJECTS } from '../constants';
import { createStudent, getStudent, updateStudent } from '../services/api';

const EMPTY = { name: '', email: '', enrollment: '', subject: '' };

export default function StudentFormScreen({ navigation, route }) {
  const { id } = route.params || {};
  const [values, setValues] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: id ? 'Editar aluno' : 'Novo aluno' });
  }, [id, navigation]);

  useEffect(() => {
    if (!id) return undefined;

    let ativo = true;
    setLoading(true);

    getStudent(id)
      .then((student) => {
        if (!ativo) return;
        setValues({
          name: student.name || '',
          email: student.email || '',
          enrollment: student.enrollment || '',
          subject: student.subject || '',
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
    if (!values.name.trim() || !values.email.trim()) {
      setError('Preencha nome e e-mail.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        enrollment: values.enrollment.trim() || null,
        subject: values.subject.trim() || null,
      };
      if (id) await updateStudent(id, payload);
      else await createStudent(payload);
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
          <ErrorBanner message={error} />
          <Field label="Nome" value={values.name} onChangeText={(value) => handleChange('name', value)} />
          <Field
            label="E-mail"
            value={values.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCapitalize="none"
          />
          <Field
            label="Matrícula"
            value={values.enrollment}
            onChangeText={(value) => handleChange('enrollment', value)}
            autoCapitalize="none"
          />
          <Muted>Matéria inscrita</Muted>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 12 }}>
            {SUBJECTS.map((materia) => (
              <Chip
                key={materia}
                label={materia}
                selected={values.subject === materia}
                onPress={() => handleChange('subject', values.subject === materia ? '' : materia)}
              />
            ))}
          </View>
          <Button title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSubmit} disabled={saving} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
