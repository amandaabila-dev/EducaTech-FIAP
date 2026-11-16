import { Image, StyleSheet, Text, View } from 'react-native';

import theme from '../theme';

export default function BrandHeader() {
  return (
    <View style={styles.wrap}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>EducaTech FIAP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  title: {
    color: theme.colors.textInverse,
    fontWeight: '700',
    fontSize: 16,
  },
});
