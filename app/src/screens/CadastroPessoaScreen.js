import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Snackbar,
  HelperText
} from 'react-native-paper';
import { pessoaService } from '../services/api';

export default function CadastroPessoaScreen({ navigation, route }) {
  const pessoaEdicao = route?.params?.pessoa;
  const [cpf, setCpf] = useState(pessoaEdicao?.cpf || '');
  const [nome, setNome] = useState(pessoaEdicao?.nome || '');
  const [peso, setPeso] = useState(pessoaEdicao?.peso?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validar = () => {
    const novosErros = {};
    
    if (!cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (cpf.length > 15) {
      novosErros.cpf = 'CPF deve ter no máximo 15 caracteres';
    }
    
    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.length > 100) {
      novosErros.nome = 'Nome deve ter no máximo 100 caracteres';
    }
    
    if (!peso.trim()) {
      novosErros.peso = 'Peso é obrigatório';
    } else {
      const pesoNum = parseFloat(peso);
      if (isNaN(pesoNum) || pesoNum <= 0) {
        novosErros.peso = 'Peso deve ser um número positivo';
      }
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) {
      return;
    }

    setLoading(true);
    try {
      const pessoaData = {
        cpf: cpf.trim(),
        nome: nome.trim(),
        peso: parseFloat(peso),
      };

      if (pessoaEdicao) {
        await pessoaService.atualizar(pessoaEdicao.cpf, pessoaData);
        setSnackbarMessage('Pessoa atualizada com sucesso!');
      } else {
        await pessoaService.criar(pessoaData);
        setSnackbarMessage('Pessoa cadastrada com sucesso!');
      }
      
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        setSnackbarMessage('CPF já cadastrado!');
      } else {
        setSnackbarMessage('Erro ao salvar pessoa. Verifique se a API está rodando.');
      }
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={setCpf}
          mode="outlined"
          style={styles.input}
          maxLength={15}
          editable={!pessoaEdicao}
          error={!!errors.cpf}
        />
        <HelperText type="error" visible={!!errors.cpf}>
          {errors.cpf}
        </HelperText>

        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
          maxLength={100}
          error={!!errors.nome}
        />
        <HelperText type="error" visible={!!errors.nome}>
          {errors.nome}
        </HelperText>

        <TextInput
          label="Peso (kg)"
          value={peso}
          onChangeText={setPeso}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.peso}
        />
        <HelperText type="error" visible={!!errors.peso}>
          {errors.peso}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSalvar}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {pessoaEdicao ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});




