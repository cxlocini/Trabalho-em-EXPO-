import axios from 'axios';

// IMPORTANTE: Altere este endereço para o IP da máquina onde a API está rodando
// Use o IP local da sua rede (ex: 192.168.1.100) e não localhost
// NÃO inclua /api/pessoas aqui, apenas o endereço base
const API_BASE_URL = 'http://192.168.0.104:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logar requisições
api.interceptors.request.use(
  (config) => {
    const urlCompleta = `${config.baseURL}${config.url}`;
    console.log('[Axios] Requisição:', config.method?.toUpperCase(), urlCompleta);
    if (config.data) {
      console.log('[Axios] Body:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('[Axios] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log('[Axios] Resposta OK:', response.config.method?.toUpperCase(), `${response.config.baseURL}${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    const urlCompleta = error.config ? `${error.config.baseURL}${error.config.url}` : 'URL não disponível';
    console.error('[Axios] Erro na resposta:', error.response?.status, urlCompleta);
    if (error.response?.data) {
      console.error('[Axios] Dados do erro:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const pessoaService = {
  listarTodas: async () => {
    try {
      const url = '/api/pessoas';
      console.log('[pessoaService] Chamando GET:', `${API_BASE_URL}${url}`);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const urlFinal = error.response?.config?.url || error.config?.url || 'URL não disponível';
      console.error('Erro ao listar pessoas:', error);
      console.error('[pessoaService] URL que causou erro:', urlFinal);
      console.error('[pessoaService] Status:', error.response?.status);
      throw error;
    }
  },

  buscarPorCpf: async (cpf) => {
    try {
      const cpfEncoded = encodeURIComponent(cpf);
      const url = `/api/pessoas/${cpfEncoded}`;
      console.log('[pessoaService] Chamando GET:', `${API_BASE_URL}${url}`);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const urlFinal = error.response?.config?.url || error.config?.url || 'URL não disponível';
      console.error('Erro ao buscar pessoa:', error);
      console.error('[pessoaService] URL que causou erro:', urlFinal);
      console.error('[pessoaService] Status:', error.response?.status);
      throw error;
    }
  },

  criar: async (pessoa) => {
    try {
      const url = '/api/pessoas';
      console.log('[pessoaService] Chamando POST:', `${API_BASE_URL}${url}`, pessoa);
      const response = await api.post(url, pessoa);
      return response.data;
    } catch (error) {
      const urlFinal = error.response?.config?.url || error.config?.url || 'URL não disponível';
      console.error('Erro ao criar pessoa:', error);
      console.error('[pessoaService] URL que causou erro:', urlFinal);
      console.error('[pessoaService] Status:', error.response?.status);
      throw error;
    }
  },

  atualizar: async (cpf, pessoa) => {
    try {
      const cpfEncoded = encodeURIComponent(cpf);
      const url = `/api/pessoas/${cpfEncoded}`;
      console.log('[pessoaService] Chamando PUT:', `${API_BASE_URL}${url}`, pessoa);
      const response = await api.put(url, pessoa);
      return response.data;
    } catch (error) {
      const urlFinal = error.response?.config?.url || error.config?.url || 'URL não disponível';
      console.error('Erro ao atualizar pessoa:', error);
      console.error('[pessoaService] URL que causou erro:', urlFinal);
      console.error('[pessoaService] Status:', error.response?.status);
      throw error;
    }
  },

  deletar: async (cpf) => {
    try {
      const cpfEncoded = encodeURIComponent(cpf);
      const url = `/api/pessoas/${cpfEncoded}`;
      console.log('[pessoaService] Chamando DELETE:', `${API_BASE_URL}${url}`);
      await api.delete(url);
    } catch (error) {
      const urlFinal = error.response?.config?.url || error.config?.url || 'URL não disponível';
      console.error('Erro ao deletar pessoa:', error);
      console.error('[pessoaService] URL que causou erro:', urlFinal);
      console.error('[pessoaService] Status:', error.response?.status);
      throw error;
    }
  },
};

export default api;



