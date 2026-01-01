import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'

let tokenSession = sessionStorage.getItem('token')

class TermoResponsabilidadeService {
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

  createTermo(eventoId: string, conteudoPersonalizado?: string): Promise<any> {
    return this.handleRequest(
      apiClient.post('/termo-responsabilidade', {
        eventoId,
        conteudoPersonalizado
      }, {
        headers: {
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to create termo responsabilidade'
    )
  }

  getTermosAceitosByEvento(eventoId: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/termo-responsabilidade/aceites/evento/${eventoId}`, {
        headers: {
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to get termos aceitos by evento'
    )
  }

  getVerificarAceitouTermo(eventoId: string, atletaId: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/termo-responsabilidade/verificar/${eventoId}/${atletaId}`, {
        headers: {
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to get verificar aceitou termo'
    )
  }
}

export default new TermoResponsabilidadeService()
