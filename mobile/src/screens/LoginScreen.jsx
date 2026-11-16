import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Card, ErrorBanner, Field, Screen, Subtitle, Title } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigation.replace('Tabs');
  }, [isAuthenticated, navigation]);

  if (isAuthenticated) return null;

  async function handleSubmit() {
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), senha);
      navigation.replace('Tabs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView>
          <Card>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Title>EducaTech FIAP</Title>
            <Subtitle>Área exclusiva para professores publicarem e gerenciarem conteúdos.</Subtitle>
            <ErrorBanner message={error} />
            <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Field label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
            <Button title={submitting ? 'Entrando...' : 'Entrar'} onPress={handleSubmit} disabled={submitting} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
});
