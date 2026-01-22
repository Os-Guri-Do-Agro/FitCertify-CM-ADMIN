import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'

class certificadoService {
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

  baixarCertificado(modeloCertificadoId : string, atletaId: string): Promise<any> {
    const token = this.getToken()
    return apiClient.post(`/certificado/baixar-certificado?modeloCertificadoId=${modeloCertificadoId}&atletaId=${atletaId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob'
    })
  }
}

export default new certificadoService()
