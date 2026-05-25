import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../../src/constants/theme';
import { ProdutoForm } from '../../../src/components/forms/ProdutoForm';

export default function NovoProdutoScreen() {
  return (
    <View style={styles.container}>
      <ProdutoForm modo="criacao" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
