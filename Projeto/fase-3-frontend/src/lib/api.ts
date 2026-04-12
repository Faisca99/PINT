import axios from 'axios';

// Instância do Axios apontada para o nosso backend em NestJS (que vai correr na porta 3001)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// === SERVIÇOS PARA A API DO NESTJS ===

// 1. Obter o Dashboard e Pontos do Consultor
export const getDashboardConsultor = async (idConsultor: string) => {
  const response = await api.get(`/dashboard/consultant/${idConsultor}`);
  return response.data;
};

// 2. Obter todos os Badges Catálogo (Views que criámos na BD)
export const getTodosBadges = async () => {
  const response = await api.get('/badges');
  return response.data;
};

// 3. Obter status das candidaturas do Consultor logado
export const getMinhasCandidaturas = async (idConsultor: string) => {
  const response = await api.get(`/applications/consultant/${idConsultor}`);
  return response.data;
};

// 4. Submeter Nova Candidatura (FormData suporta ficheiros + json)
export const submitCandidatura = async (candidaturaData: object) => {
  const response = await api.post('/applications', candidaturaData, {
    headers: { 'Content-Type': 'multipart/form-data' } // Importante para upload de ficheiros
  });
  return response.data;
};

// 5. (Aprovadores) Listar candidaturas por estado
export const getAprovacoesPendentes = async (estado: string) => {
  const response = await api.get(`/applications/status/${estado}`);
  return response.data;
};

export default api;
