import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB, 
  ActivityIndicator,
  Snackbar,
  IconButton
} from 'react-native-paper';
import { pessoaService } from '../services/api';

export default function ListaPessoasScreen({ navigation }) {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const carregarPessoas = async () => {
    try {
      const dados = await pessoaService.listarTodas();
      setPessoas(dados);
    } catch (error) {
      setSnackbarMessage('Erro ao carregar pessoas. Verifique se a API está rodando.');
      setSnackbarVisible(true);
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPessoas();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarPessoas();
  };

  const handleDeletar = async (cpf) => {
    try {
      await pessoaService.deletar(cpf);
      setSnackbarMessage('Pessoa deletada com sucesso!');
      setSnackbarVisible(true);
      carregarPessoas();
    } catch (error) {
      setSnackbarMessage('Erro ao deletar pessoa.');
      setSnackbarVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {pessoas.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Nenhuma pessoa cadastrada</Title>
              <Paragraph>Toque no botão + para adicionar uma nova pessoa.</Paragraph>
            </Card.Content>
          </Card>
        ) : (
          pessoas.map((pessoa) => (
            <Card key={pessoa.cpf} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Title>{pessoa.nome}</Title>
                    <Paragraph>CPF: {pessoa.cpf}</Paragraph>
                    <Paragraph>Peso: {pessoa.peso} kg</Paragraph>
                  </View>
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => handleDeletar(pessoa.cpf)}
                  />
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroPessoa')}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});




