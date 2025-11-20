import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'

class SolicitacaoCertificadoService {
  private getToken(): string | null {
    return sessionStorage.getItem('token')
  }
  private async handleRequest<T>(
    request: Promise<{ data: T }>,
    errorMessage: string
  ): Promise<T> {
    try {
      const { data } = await request
      return data
    } catch (error: any) {
      handleError(`${errorMessage}: ${error.message}`, error)
      throw error
    }
  }

  getAllSolicitacoesCertificados(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/solicitacao-certificado'),
      'Failed to fetch all organizacao'
    )
  }

  findAllPaginatedSolicitacoesCertificados(page: number, size: number, situacao: string): Promise<any> {
    const token = this.getToken()

    return this.handleRequest(
      apiClient.get(`/solicitacao-certificado/findAllPaginated?page=${page}&size=${size}&situacao=${situacao}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to fetch all solicitacoes certificados'
    )
  }

  getSolicitacaoCertificadoById(id: string): Promise<any> {
    const token = this.getToken()
    return this.handleRequest(
      apiClient.get(`/solicitacao-certificado/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to fetch solicitacao certificado by id'
    )
  }

  putSolicitacaoCertificado(id: string, data: any): Promise<any> {
    const token = this.getToken()
    return this.handleRequest(
      apiClient.patch(`/solicitacao-certificado/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to put solicitacao certificado'
    )
  }

  deleteSolicitacaoCertificado(id: string): Promise<any> {
    const token = this.getToken()
    return this.handleRequest(
      apiClient.delete(`/solicitacao-certificado/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to delete solicitacao certificado'
    )
  }

  createSolicitacaoCertificado(formData: FormData): Promise<any> {
    const token = this.getToken()
    return this.handleRequest(
      apiClient.post('/solicitacao-certificado', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to create solicitacao certificado'
    )
  }

  updateSolicitacaoCertificado(id: string, formData: FormData): Promise<any> {
    const token = this.getToken()
    return this.handleRequest(
      apiClient.patch(`/solicitacao-certificado/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }),
      'Failed to update solicitacao certificado'
    )
  }
}

export default new SolicitacaoCertificadoService()
