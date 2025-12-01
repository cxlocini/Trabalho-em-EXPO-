import axios from 'axios';

// IMPORTANTE: Altere este endereço para o IP da máquina onde a API está rodando
// Use o IP local da sua rede (ex: 192.168.1.100) e não localhost
const API_BASE_URL = 'http://192.168.1.100:8080/api/pessoas';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pessoaService = {
  listarTodas: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar pessoas:', error);
      throw error;
    }
  },

  buscarPorCpf: async (cpf) => {
    try {
      const response = await api.get(`/${cpf}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error);
      throw error;
    }
  },

  criar: async (pessoa) => {
    try {
      const response = await api.post('/', pessoa);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      throw error;
    }
  },

  atualizar: async (cpf, pessoa) => {
    try {
      const response = await api.put(`/${cpf}`, pessoa);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      throw error;
    }
  },

  deletar: async (cpf) => {
    try {
      await api.delete(`/${cpf}`);
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
      throw error;
    }
  },
};

export default api;


