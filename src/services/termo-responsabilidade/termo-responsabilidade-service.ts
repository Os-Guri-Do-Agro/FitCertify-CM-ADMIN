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
}

export default new TermoResponsabilidadeService()
